import "~/config/env";
import { mustGetMutator } from "@rocicorp/zero";
import { handleMutateRequest } from "@rocicorp/zero/server";
import { zeroPostgresJS } from "@rocicorp/zero/server/adapters/postgresjs";
import { createFileRoute } from "@tanstack/react-router";
import { sql } from "~/lib/db";
import { requireAuth } from "~/middleware/auth";
import { schema } from "~/zero/schema";
import { serverMutators } from "~/zero/server-mutators";

const dbProvider = zeroPostgresJS(schema, sql);

export const Route = createFileRoute("/api/zero/mutate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireAuth(request);

        const result = await handleMutateRequest(
          dbProvider,
          async (transact) =>
            await transact(async (tx, name, args) => {
              const mutator = mustGetMutator(serverMutators, name);
              return await mutator.fn({
                tx,
                args,
                ctx: { userID: session.userID },
              });
            }),
          request,
        );

        return Response.json(result);
      },
    },
  },
});
