import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/_dashboard")({
  component: IndexPage,
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.auth.getAuthenticatedUserId, {}),
    );
  },
});

function IndexPage() {
  return <Outlet />;
}
