import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/__dashboard/")({
  component: IndexPage,
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
    <div className="px-4 py-2 mx-auto mt-24 text-sm bg-white border rounded-md shadow-sm w-fit border-neutral-200 text-neutral-600">
      Redirecting to sign in...
    </div>
  );
}
