import "dotenv/config";

import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookieHeader, logout } from "~/auth/server";

export const Route = createFileRoute("/api/auth/logout")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				await logout(request);
				const secure = new URL(request.url).protocol === "https:";

				return Response.json(
					{ ok: true },
					{
						headers: {
							"Set-Cookie": clearSessionCookieHeader({ secure }),
						},
					},
				);
			},
		},
	},
});
