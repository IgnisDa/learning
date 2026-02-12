import { type WorkflowId } from "@convex-dev/workflow";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import {
  action,
  internalAction,
  internalMutation,
  query,
} from "../_generated/server";
import {
  SEARCH_RESULTS_EVENT_NAME,
  TMDB_RETRY_BEHAVIOR,
  tmdbFetch,
  tmdbWorkPool,
  tmdbWorkflow,
} from "./index";

const searchResultValidator = v.object({
  name: v.string(),
  tmdbId: v.number(),
  overview: v.string(),
  firstAirDate: v.optional(v.string()),
  posterPath: v.union(v.string(), v.null()),
});

const searchResultsValidator = v.array(searchResultValidator);

type TmdbSearchTvResponse = {
  results?: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string | undefined;
  }>;
};

export type SearchResult = {
  name: string;
  tmdbId: number;
  overview: string;
  firstAirDate?: string;
  posterPath: string | null;
};

export const fetchSearchResults = internalAction({
  args: { query: v.string() },
  handler: async (_ctx, args): Promise<SearchResult[]> => {
    const encodedQuery = encodeURIComponent(args.query);
    const data = await tmdbFetch<TmdbSearchTvResponse>(
      `/search/tv?query=${encodedQuery}&include_adult=false`,
    );

    return (data.results ?? []).map((r) => ({
      tmdbId: r.id,
      name: r.name,
      overview: r.overview,
      posterPath: r.poster_path,
      firstAirDate: r.first_air_date,
    }));
  },
});

export const searchShowsWorkflow = tmdbWorkflow.define({
  args: { query: v.string() },
  returns: searchResultsValidator,
  handler: async (ctx, args): Promise<SearchResult[]> => {
    await tmdbWorkPool.enqueueAction(
      ctx,
      internal.tmdb.search.fetchSearchResults,
      { query: args.query },
      {
        retry: TMDB_RETRY_BEHAVIOR,
        onComplete: internal.tmdb.index.handleWorkpoolCompletion,
        context: {
          workflowId: ctx.workflowId,
          eventName: SEARCH_RESULTS_EVENT_NAME,
        },
      },
    );

    return await ctx.awaitEvent({
      name: SEARCH_RESULTS_EVENT_NAME,
      validator: searchResultsValidator,
    });
  },
});

export const searchShows = action({
  args: { query: v.string() },
  handler: async (ctx, args): Promise<{ workId: string }> => {
    const trimmedQuery = args.query.trim();

    if (trimmedQuery.length < 2) return { workId: "" };

    const workflowId = await tmdbWorkflow.start(
      ctx,
      internal.tmdb.search.searchShowsWorkflow,
      { query: trimmedQuery },
      { startAsync: true },
    );

    return { workId: workflowId };
  },
});

export const searchShowsResult = query({
  args: { workId: v.string() },
  handler: async (ctx, args) => {
    if (!args.workId) return null;

    const status = await tmdbWorkflow.status(ctx, args.workId as WorkflowId);

    if (status.type === "inProgress")
      return {
        error: undefined,
        result: undefined,
        workId: args.workId,
        status: "pending" as const,
      };

    if (status.type === "completed")
      return {
        error: undefined,
        workId: args.workId,
        status: "complete" as const,
        result: status.result as SearchResult[] | undefined,
      };

    return {
      result: undefined,
      workId: args.workId,
      status: "complete" as const,
      error:
        status.type === "failed"
          ? status.error
          : "Search workflow was canceled",
    };
  },
});
