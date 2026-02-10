import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <>
      <AuthLoading>
        <div className="mx-auto mt-24 w-fit rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm">
          Loading...
        </div>
      </AuthLoading>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
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
    <div className="mx-auto mt-24 w-fit rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm">
      Redirecting to sign in...
    </div>
  );
}
