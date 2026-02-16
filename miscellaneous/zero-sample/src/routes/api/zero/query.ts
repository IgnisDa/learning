import { mustGetQuery } from "@rocicorp/zero";
import { handleQueryRequest } from "@rocicorp/zero/server";
import { createFileRoute } from "@tanstack/react-router";
import "~/config/env";
import { requireAuth } from "~/middleware/auth";
import { queries } from "~/zero/queries";
import { schema } from "~/zero/schema";

export const Route = createFileRoute("/api/zero/query")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await requireAuth(request);

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
