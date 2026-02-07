import "dotenv/config";

import { createFileRoute } from "@tanstack/react-router";
import { login, sessionCookieHeader } from "~/auth/server";

export const Route = createFileRoute("/api/auth/login")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body: unknown = await request.json().catch(() => null);
				const email =
					body && typeof body === "object" && "email" in body
						? String((body as Record<string, unknown>).email)
						: "";

				try {
					const result = await login(email);
					const secure = new URL(request.url).protocol === "https:";

					return Response.json(
						{ email: result.email, userID: result.userID },
						{
							headers: {
								"Set-Cookie": sessionCookieHeader({
									secure,
									token: result.token,
								}),
							},
						},
					);
				} catch (e) {
					const message = e instanceof Error ? e.message : "Invalid email";
					return Response.json({ error: message }, { status: 400 });
				}
			},
		},
	},
});
