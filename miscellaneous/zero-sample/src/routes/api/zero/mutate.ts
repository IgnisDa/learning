import { mustGetMutator } from "@rocicorp/zero";
import { handleMutateRequest } from "@rocicorp/zero/server";
import { zeroPostgresJS } from "@rocicorp/zero/server/adapters/postgresjs";
import { createFileRoute } from "@tanstack/react-router";
import "dotenv/config";
import postgres from "postgres";
import { getSession } from "~/auth/server";
import { databaseURL, isProd } from "~/lib/common";
import { mutators } from "~/zero/mutators";
import { schema } from "~/zero/schema";

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
