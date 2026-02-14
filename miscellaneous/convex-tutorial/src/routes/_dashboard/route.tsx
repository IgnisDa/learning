import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useEffect } from "react";

export const Route = createFileRoute("/_dashboard")({
  component: IndexPage,
  beforeLoad: async ({ context }) => {
    console.log(context);
  },
});

function IndexPage() {
  return (
    <>
      <AuthLoading>
        <div className="px-4 py-2 mx-auto mt-24 text-sm bg-white border rounded-md shadow-sm w-fit border-neutral-200 text-neutral-600">
          Loading...
        </div>
      </AuthLoading>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  );
}

function RedirectToSignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/signin" });
  }, [navigate]);

  return (
    <div className="px-4 py-2 mx-auto mt-24 text-sm bg-white border rounded-md shadow-sm w-fit border-neutral-200 text-neutral-600">
      Redirecting to sign in...
    </div>
  );
}
