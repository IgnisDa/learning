import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import * as cookie from "cookie";

const getAuthToken = createServerFn({ method: "GET" }).handler(async () => {
  const cookies = getRequestHeader("cookie");
  return cookie.parseCookie(cookies || "").auth_token;
});

export const Route = createFileRoute("/_dashboard")({
  component: IndexPage,
  beforeLoad: async () => {
    const token = await getAuthToken();
    if (!token) throw redirect({ to: "/signin" });
    return { token };
  },
});

function IndexPage() {
  return <Outlet />;
}
