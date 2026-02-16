import { createFileRoute } from "@tanstack/react-router";
import { login, sessionCookieHeader } from "~/auth/server";
import "~/config/env";
import { getErrorMessage } from "~/utils/error-message";
import { getSecureFlag } from "~/utils/request";
import { safeJsonParse } from "~/utils/safe-parse";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await safeJsonParse(request);
        const email =
          body && typeof body === "object" && "email" in body
            ? String((body as Record<string, unknown>).email)
            : "";

        try {
          const result = await login(email);
          const secure = getSecureFlag(request);

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
          const message = getErrorMessage(e, "Invalid email");
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  },
});
