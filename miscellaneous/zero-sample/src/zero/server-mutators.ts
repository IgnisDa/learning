import { defineMutator, defineMutators } from "@rocicorp/zero";
import { z } from "zod";
import { tmdbEnrichQueue } from "~/lib/queue";
import { mutators } from "./mutators";
import type { EnrichState, WatchStatus } from "./schema";
import { zql } from "./schema";

const watchStatusSchema = z.enum([
  "plan_to_watch",
  "watching",
  "completed",
  "on_hold",
  "dropped",
]);

export const serverMutators = defineMutators(mutators, {
  shows: {
    addFromTmdb: defineMutator(
      z.object({
        id: z.string(),
        jobId: z.string(),
        tmdbId: z.number(),
        forceEnrich: z.boolean().optional(),
        watchStatus: watchStatusSchema.optional(),
        startedAt: z.number().nullable().optional(),
        name: z.string(),
        overview: z.string().nullable().optional(),
        posterPath: z.string().nullable().optional(),
      }),
      async ({ ctx, tx, args }) => {
        const now = Date.now();
        const forceEnrich = args.forceEnrich ?? false;

        let existingState: {
          enrichError: string | null;
          enrichState: EnrichState;
          enrichedAt: number | null;
        } | null = null;

        existingState =
          (await tx.run(zql.show.where("id", args.id).one())) ?? null;

        const shouldEnqueue =
          forceEnrich ||
          !existingState ||
          existingState.enrichState === "error";

        await mutators.shows.addFromTmdb.fn({ ctx, tx, args });

        if (shouldEnqueue) {
          await tmdbEnrichQueue.add(
            "enrich_show",
            { showId: args.id, tmdbId: args.tmdbId },
            { jobId: args.jobId },
          );
        }
      },
    ),
  },
});
