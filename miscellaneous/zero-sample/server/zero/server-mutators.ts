import { defineMutator, defineMutators } from "@rocicorp/zero";
import { z } from "zod";
import { watchStatusSchema } from "../../src/constants/watch-status";
import { mutators } from "../../src/zero/mutators";
import { zql } from "../../src/zero/schema";
import { tmdbEnrichQueue } from "../lib/queue";

export const serverMutators = defineMutators(mutators, {
  shows: {
    addFromTmdb: defineMutator(
      z.object({
        id: z.string(),
        name: z.string(),
        jobId: z.string(),
        tmdbId: z.number(),
        forceEnrich: z.boolean().optional(),
        watchStatus: watchStatusSchema.optional(),
        overview: z.string().nullable().optional(),
        startedAt: z.number().nullable().optional(),
        posterPath: z.string().nullable().optional(),
      }),
      async ({ ctx, tx, args }) => {
        const forceEnrich = args.forceEnrich ?? false;

        const existingState =
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
