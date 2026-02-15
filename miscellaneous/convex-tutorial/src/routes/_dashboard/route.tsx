import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCookie } from "../../utils/cookies";

export const Route = createFileRoute("/_dashboard")({
  component: IndexPage,
  beforeLoad: () => {
    const token =
      typeof window !== "undefined" ? getCookie("convex_auth_token") : null;

    if (!token) throw redirect({ to: "/signin" });

    return { token };
  },
});

function IndexPage() {
  return <Outlet />;
}
