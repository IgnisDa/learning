import { type WorkflowId, WorkflowManager } from "@convex-dev/workflow";
import { Workpool, vOnCompleteArgs } from "@convex-dev/workpool";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import {
  action,
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";

const wikipediaWorkpool = new Workpool(components.wikipediaWorkpool, {
  maxParallelism: 5,
});

const wikipediaWorkflow = new WorkflowManager(components.workflow, {
  workpoolOptions: { maxParallelism: 5 },
});

const WIKIPEDIA_SUMMARY_EVENT_NAME = "wikipedia.summary";

const WIKIPEDIA_RETRY_BEHAVIOR = {
  base: 2,
  maxAttempts: 5,
  initialBackoffMs: 400,
} as const;

const workflowCompletionValidator = v.object({
  workflowId: v.string(),
  context: v.any(),
  result: v.union(
    v.object({ kind: v.literal("success"), returnValue: v.any() }),
    v.object({ kind: v.literal("failed"), error: v.string() }),
    v.object({ kind: v.literal("canceled") }),
  ),
});

export const sendMessage = mutation({
  args: { user: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      user: args.user,
      body: args.body,
    });

    if (args.body.startsWith("/wiki")) {
      const firstSpace = args.body.indexOf(" ");
      const topic =
        firstSpace === -1 ? "" : args.body.slice(firstSpace + 1).trim();
      if (topic.length < 2) return;

      await wikipediaWorkflow.start(
        ctx,
        internal.chat.wikipediaLookupWorkflow,
        { topic },
        {
          startAsync: true,
          onComplete: internal.chat.postWikipediaSummaryMessage,
          context: { topic },
        },
      );
    }
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(50);
    return messages.reverse();
  },
});

export const getWikipediaSummary = internalAction({
  args: { topic: v.string() },
  handler: async (_ctx, args): Promise<string> => {
    const response = await fetch(
      "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" +
        args.topic,
    );

    const summary = getSummaryFromJSON(await response.json());
    return summary || "No summary found for that topic.";
  },
});

export const handleWorkpoolCompletion = internalMutation({
  args: vOnCompleteArgs(
    v.object({
      workflowId: v.string(),
      eventName: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    if (args.result.kind === "success") {
      await wikipediaWorkflow.sendEvent(ctx, {
        workflowId: args.context.workflowId as WorkflowId,
        name: args.context.eventName,
        validator: v.string(),
        value: String(args.result.returnValue ?? ""),
      });
      return;
    }

    await wikipediaWorkflow.sendEvent(ctx, {
      workflowId: args.context.workflowId as WorkflowId,
      name: args.context.eventName,
      error:
        args.result.kind === "failed"
          ? args.result.error
          : "Wikipedia lookup was canceled",
    });
  },
});

export const wikipediaLookupWorkflow = wikipediaWorkflow.define({
  args: { topic: v.string() },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    await wikipediaWorkpool.enqueueAction(
      ctx,
      internal.chat.getWikipediaSummary,
      { topic: args.topic },
      {
        retry: WIKIPEDIA_RETRY_BEHAVIOR,
        onComplete: internal.chat.handleWorkpoolCompletion,
        context: {
          workflowId: ctx.workflowId,
          eventName: WIKIPEDIA_SUMMARY_EVENT_NAME,
        },
      },
    );

    return await ctx.awaitEvent({
      name: WIKIPEDIA_SUMMARY_EVENT_NAME,
      validator: v.string(),
    });
  },
});

export const startWikipediaLookup = action({
  args: { topic: v.string() },
  handler: async (ctx, args): Promise<{ workId: string }> => {
    const trimmedTopic = args.topic.trim();
    if (trimmedTopic.length < 2) return { workId: "" };

    const workflowId = await wikipediaWorkflow.start(
      ctx,
      internal.chat.wikipediaLookupWorkflow,
      { topic: trimmedTopic },
      { startAsync: true },
    );

    return { workId: workflowId };
  },
});

export const wikipediaLookupResult = query({
  args: { workId: v.string() },
  handler: async (ctx, args) => {
    if (!args.workId) return null;

    const status = await wikipediaWorkflow.status(
      ctx,
      args.workId as WorkflowId,
    );

    if (status.type === "inProgress") {
      return {
        error: undefined,
        result: undefined,
        workId: args.workId,
        status: "pending" as const,
      };
    }

    if (status.type === "completed") {
      return {
        error: undefined,
        workId: args.workId,
        status: "complete" as const,
        result: status.result as string | undefined,
      };
    }

    return {
      result: undefined,
      workId: args.workId,
      status: "complete" as const,
      error:
        status.type === "failed"
          ? status.error
          : "Wikipedia workflow was canceled",
    };
  },
});

export const postWikipediaSummaryMessage = internalMutation({
  args: workflowCompletionValidator,
  handler: async (ctx, args) => {
    if (args.result.kind === "success") {
      await ctx.db.insert("messages", {
        body: String(
          args.result.returnValue ?? "No summary found for that topic.",
        ),
        user: "Wikipedia",
      });
      return;
    }

    await ctx.db.insert("messages", {
      body:
        args.result.kind === "failed"
          ? `Wikipedia lookup failed: ${args.result.error}`
          : "Wikipedia lookup was canceled",
      user: "Wikipedia",
    });
  },
});

function getSummaryFromJSON(data: any) {
  const firstPageId = Object.keys(data.query.pages)[0];
  return data.query.pages[firstPageId].extract;
}
