import { defineMutator, defineMutators } from "@rocicorp/zero";
import { z } from "zod";
import type { EnrichState } from "./schema";
import { zql } from "./schema";

export const mutators = defineMutators({
	shows: {
		addFromTmdb: defineMutator(
			z.object({
				id: z.string(),
				jobId: z.string(),
				tmdbId: z.number(),
				forceEnrich: z.boolean().optional(),
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

				if (tx.location === "server") {
					existingState =
						(await tx.run(zql.show.where("id", args.id).one())) ?? null;
				}

				const shouldEnqueue =
					forceEnrich ||
					!existingState ||
					existingState.enrichState === "error";

				const nextEnrichState: EnrichState = shouldEnqueue
					? "queued"
					: (existingState?.enrichState ?? "queued");

				await tx.mutate.show.upsert({
					id: args.id,
					name: args.name,
					tmdbId: args.tmdbId,
					overview: args.overview ?? null,
					posterPath: args.posterPath ?? null,
					enrichState: nextEnrichState,
					enrichError: shouldEnqueue
						? null
						: (existingState?.enrichError ?? null),
					enrichedAt: shouldEnqueue
						? null
						: (existingState?.enrichedAt ?? null),
				});

				// Must happen after upserting show due to FK user_show.show_id -> show.id.
				await tx.mutate.userShow.upsert({
					userId: ctx.userID,
					showId: args.id,
					addedAt: now,
				});

				if (tx.location === "server" && shouldEnqueue) {
					await tx.mutate.outbox.upsert({
						id: args.jobId,
						topic: "tmdb.enrich_show",
						showId: args.id,
						tmdbId: args.tmdbId,
						status: "pending",
						attempts: 0,
						lockedAt: null,
						lastError: null,
						createdAt: now,
					});
				}
			},
		),
	},
});
