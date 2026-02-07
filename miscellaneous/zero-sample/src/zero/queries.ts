import { defineQueries, defineQuery } from "@rocicorp/zero";
import { z } from "zod";
import { zql } from "./schema";

export const queries = defineQueries({
	library: {
		items: defineQuery(({ ctx }) =>
			zql.userShow
				.where("userId", ctx.userID)
				.orderBy("addedAt", "desc")
				.related("show", (show) => show.one()),
		),
		showDetails: defineQuery(
			z.object({ showId: z.string() }),
			({ ctx, args: { showId } }) =>
				zql.userShow
					.where("userId", ctx.userID)
					.where("showId", showId)
					.related("show", (show) =>
						show
							.one()
							.related("seasons", (season) =>
								season
									.orderBy("seasonNumber", "asc")
									.related("episodes", (episode) =>
										episode.orderBy("episodeNumber", "asc"),
									),
							)
							.related("credits", (credit) =>
								credit
									.orderBy("kind", "asc")
									.orderBy("orderIndex", "asc")
									.orderBy("department", "asc")
									.orderBy("job", "asc")
									.related("person", (person) => person.one()),
							),
					)
					.limit(1),
		),
	},
});
