import { api, internal } from "./_generated/api";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const sendMessage = mutation({
  args: { body: v.string() },
  handler: async (ctx, { body }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User must be authenticated to send messages");
    }
    
    // Get user's email to display in chat
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const userDisplay = user.email || "Anonymous";
    
    await ctx.db.insert("messages", { body, user: userDisplay });

    if (body.startsWith("/wiki")) {
      const topic = body.slice(body.indexOf(" ") + 1);
      await ctx.scheduler.runAfter(0, internal.chat.getWikipediaSummary, {
        topic,
      });
    }
  },
});

export const getMessages = query({
  args: {},
  handler: async ({ db }) => {
    const messages = await db.query("messages").order("desc").take(50);
    return messages.reverse();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const sendWikipediaMessage = internalMutation({
  args: { body: v.string() },
  handler: async (ctx, { body }) => {
    await ctx.db.insert("messages", { body, user: "Wikipedia" });
  },
});

export const getWikipediaSummary = internalAction({
  args: { topic: v.string() },
  handler: async ({ runMutation }, { topic }) => {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(topic)}`,
    );

    const summary = getSummaryFromJSON(await response.json());
    await runMutation(internal.chat.sendWikipediaMessage, {
      body: summary,
    });
  },
});

function getSummaryFromJSON(data: any) {
  const firstPageId = Object.keys(data.query.pages)[0];
  return data.query.pages[firstPageId].extract;
}
