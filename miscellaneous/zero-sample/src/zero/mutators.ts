import { defineMutator, defineMutators } from "@rocicorp/zero";
import { z } from "zod";
import type { EnrichState, WatchStatus } from "./schema";
import { zql } from "./schema";

const watchStatusSchema = z.enum([
	"plan_to_watch",
	"watching",
	"completed",
	"on_hold",
	"dropped",
]);

export const mutators = defineMutators({
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

				let existingUserShow: {
					watchStatus: WatchStatus | null;
					startedAt: number | null;
					currentSeason: number | null;
					currentEpisode: number | null;
					targetFinishAt: number | null;
					rating: number | null;
					isFavorite: boolean | null;
					notes: string | null;
					setupStep: number | null;
					setupCompletedAt: number | null;
				} | null = null;

				existingUserShow =
					(await tx.run(
						zql.userShow
							.where("userId", ctx.userID)
							.where("showId", args.id)
							.one(),
					)) ?? null;

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
					watchStatus:
						args.watchStatus ?? existingUserShow?.watchStatus ?? "plan_to_watch",
					startedAt: args.startedAt ?? existingUserShow?.startedAt ?? null,
					currentSeason: existingUserShow?.currentSeason ?? null,
					currentEpisode: existingUserShow?.currentEpisode ?? null,
					targetFinishAt: existingUserShow?.targetFinishAt ?? null,
					rating: existingUserShow?.rating ?? null,
					isFavorite: existingUserShow?.isFavorite ?? false,
					notes: existingUserShow?.notes ?? null,
					setupStep: Math.max(2, existingUserShow?.setupStep ?? 1),
					setupCompletedAt: existingUserShow?.setupCompletedAt ?? null,
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
		updateProgressStep: defineMutator(
			z.object({
				showId: z.string(),
				currentSeason: z.number().int().min(1).nullable().optional(),
				currentEpisode: z.number().int().min(1).nullable().optional(),
				targetFinishAt: z.number().nullable().optional(),
			}),
			async ({ ctx, tx, args }) => {
				const existing = await tx.run(
					zql.userShow
						.where("userId", ctx.userID)
						.where("showId", args.showId)
						.one(),
				);

				if (!existing) {
					throw new Error("Show must be added before progress setup");
				}

				await tx.mutate.userShow.update({
					userId: ctx.userID,
					showId: args.showId,
					currentSeason: args.currentSeason ?? null,
					currentEpisode: args.currentEpisode ?? null,
					targetFinishAt: args.targetFinishAt ?? null,
					setupStep: Math.max(existing.setupStep ?? 1, 3),
				});
			},
		),
		completeSetupStep: defineMutator(
			z.object({
				showId: z.string(),
				rating: z.number().int().min(1).max(10).nullable().optional(),
				isFavorite: z.boolean().optional(),
				notes: z.string().max(2000).nullable().optional(),
			}),
			async ({ ctx, tx, args }) => {
				const existing = await tx.run(
					zql.userShow
						.where("userId", ctx.userID)
						.where("showId", args.showId)
						.one(),
				);

				if (!existing) {
					throw new Error("Show must be added before completing setup");
				}

				await tx.mutate.userShow.update({
					userId: ctx.userID,
					showId: args.showId,
					rating: args.rating ?? null,
					isFavorite: args.isFavorite ?? false,
					notes: args.notes ?? null,
					setupStep: 3,
					setupCompletedAt: Date.now(),
				});
			},
		),
		updateTrackingDetails: defineMutator(
			z.object({
				showId: z.string(),
				watchStatus: watchStatusSchema.optional(),
				startedAt: z.number().nullable().optional(),
				currentSeason: z.number().int().min(1).nullable().optional(),
				currentEpisode: z.number().int().min(1).nullable().optional(),
				targetFinishAt: z.number().nullable().optional(),
				rating: z.number().int().min(1).max(10).nullable().optional(),
				isFavorite: z.boolean().optional(),
				notes: z.string().max(2000).nullable().optional(),
			}),
			async ({ ctx, tx, args }) => {
				const existing = await tx.run(
					zql.userShow
						.where("userId", ctx.userID)
						.where("showId", args.showId)
						.one(),
				);

				if (!existing) {
					throw new Error("Show must be added before editing setup");
				}

				await tx.mutate.userShow.update({
					userId: ctx.userID,
					showId: args.showId,
					watchStatus: args.watchStatus ?? existing.watchStatus ?? "plan_to_watch",
					startedAt: args.startedAt ?? null,
					currentSeason: args.currentSeason ?? null,
					currentEpisode: args.currentEpisode ?? null,
					targetFinishAt: args.targetFinishAt ?? null,
					rating: args.rating ?? null,
					isFavorite: args.isFavorite ?? false,
					notes: args.notes ?? null,
				});
			},
		),
	},
});
