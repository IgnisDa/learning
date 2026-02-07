import "dotenv/config";

import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "~/auth/server";

export const Route = createFileRoute("/api/auth/me")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const session = await getSession(request);
				if (!session) {
					return Response.json({ error: "Unauthorized" }, { status: 401 });
				}

				return Response.json(session);
			},
		},
	},
});
