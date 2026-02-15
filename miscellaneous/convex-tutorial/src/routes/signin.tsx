import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useConvex } from "convex/react";
import { api } from "convex/_generated/api";
import { useEffect, useState, type FormEvent } from "react";
import { getCookie, setCookie } from "../utils/cookies";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

function SignInPage() {
  const token = getCookie("convex_auth_token");

  if (token) {
    return <RedirectToHome />;
  }

  return <SignInForm />;
}

function RedirectToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <div className="px-4 py-2 mx-auto mt-24 text-sm bg-white border rounded-md shadow-sm w-fit border-neutral-200 text-neutral-600">
      Redirecting...
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const convex = useConvex();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const result = await convex.mutation(api.auth.signIn, {
        username,
        password,
      });
      setCookie("convex_auth_token", result.token);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 mx-auto mt-10 bg-white border shadow-sm rounded-xl border-neutral-200">
      <div className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Convex Tutorial
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Sign in
        </h2>
        <p className="text-sm text-neutral-600">Continue to your workspace.</p>
      </div>

      {error && (
        <div className="px-3 py-2 mb-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Username</span>
          <input
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:shadow-[0_0_0_1px_rgba(23,23,23,0.15)] disabled:cursor-not-allowed disabled:bg-neutral-100"
            disabled={isLoading}
            name="username"
            placeholder="Username"
            required
            type="text"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Password</span>
          <input
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:shadow-[0_0_0_1px_rgba(23,23,23,0.15)] disabled:cursor-not-allowed disabled:bg-neutral-100"
            disabled={isLoading}
            name="password"
            placeholder="Password"
            required
            type="password"
          />
        </label>

        <button
          className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-neutral-600">
        Don't have an account?{" "}
        <Link
          className="font-medium text-neutral-900 hover:text-neutral-700"
          to="/signup"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
