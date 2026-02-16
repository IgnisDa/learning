import "~/config/env";
import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookieHeader, logout } from "~/auth/server";
import { getSecureFlag } from "~/utils/request";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await logout(request);
        const secure = getSecureFlag(request);

        return Response.json(
          { ok: true },
          { headers: { "Set-Cookie": clearSessionCookieHeader({ secure }) } },
        );
      },
    },
  },
});
