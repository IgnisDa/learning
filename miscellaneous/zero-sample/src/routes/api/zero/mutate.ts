import "dotenv/config";
import { mustGetMutator } from "@rocicorp/zero";
import { handleMutateRequest } from "@rocicorp/zero/server";
import { zeroPostgresJS } from "@rocicorp/zero/server/adapters/postgresjs";
import { createFileRoute } from "@tanstack/react-router";
import postgres from "postgres";
import { getSession } from "~/auth/server";
import { mutators } from "~/zero/mutators";
import { schema } from "~/zero/schema";

const databaseURL = process.env.DATABASE_URL ?? process.env.ZERO_UPSTREAM_DB;
if (!databaseURL) {
	throw new Error("DATABASE_URL (or ZERO_UPSTREAM_DB) is required");
}

const dbProvider = zeroPostgresJS(schema, postgres(databaseURL));

export const Route = createFileRoute("/api/zero/mutate")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const session = await getSession(request);
				if (!session) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				const result = await handleMutateRequest(
					dbProvider,
					async (transact) =>
						await transact(async (tx, name, args) => {
							const mutator = mustGetMutator(mutators, name);
							return await mutator.fn({
								args,
								ctx: { userID: session.userID },
								tx,
							});
						}),
					request,
				);

				return Response.json(result);
			},
		},
	},
});
