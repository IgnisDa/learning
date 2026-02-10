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
        <div className="loading">Loading...</div>
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

  return <div className="loading">Redirecting to sign in...</div>;
}
