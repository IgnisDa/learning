import "~/config/env";
import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "~/middleware/auth";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireAuth(request);
        return Response.json(session);
      },
    },
  },
});
