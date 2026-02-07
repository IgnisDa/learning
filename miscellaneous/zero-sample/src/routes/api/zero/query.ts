import "dotenv/config";
import { mustGetQuery } from "@rocicorp/zero";
import { handleQueryRequest } from "@rocicorp/zero/server";
import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "~/auth/server";
import { queries } from "~/zero/queries";
import { schema } from "~/zero/schema";

export const Route = createFileRoute("/api/zero/query")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const session = await getSession(request);
				if (!session) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const result = await handleQueryRequest(
					(name, args) => {
						const query = mustGetQuery(queries, name);
						return query.fn({
							args,
							ctx: { userID: session.userID },
						});
					},
					schema,
					request,
				);

				return Response.json(result);
			},
		},
	},
});
