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
        <div className="loading">Loading...</div>
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

  return <div className="loading">Redirecting...</div>;
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
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            disabled={isLoading}
          />
        </div>
        <input name="flow" type="hidden" value="signIn" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
