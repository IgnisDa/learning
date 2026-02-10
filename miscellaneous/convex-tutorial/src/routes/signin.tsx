import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useState, type FormEvent, useEffect } from "react";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <>
      <AuthLoading>
        <div className="mx-auto mt-24 w-fit rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm">
          Loading...
        </div>
      </AuthLoading>
      <Authenticated>
        <RedirectToHome />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </>
  );
}

function RedirectToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <div className="mx-auto mt-24 w-fit rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm">
      Redirecting...
    </div>
  );
}

function SignInForm() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
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
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">Email</span>
          <input
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:shadow-[0_0_0_1px_rgba(23,23,23,0.15)] disabled:cursor-not-allowed disabled:bg-neutral-100"
            disabled={isLoading}
            name="email"
            placeholder="Email"
            required
            type="email"
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

        <input name="flow" type="hidden" value="signIn" />

        <button
          className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Don't have an account?{" "}
        <Link className="font-medium text-neutral-900 hover:text-neutral-700" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}
