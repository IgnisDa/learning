import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useState, type FormEvent, useEffect } from "react";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <>
      <AuthLoading>
        <div className="loading">Loading...</div>
      </AuthLoading>
      <Authenticated>
        <RedirectToHome />
      </Authenticated>
      <Unauthenticated>
        <SignUpForm />
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

function SignUpForm() {
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
      setError(err instanceof Error ? err.message : "Sign up failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
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
            placeholder="Password (min 8 characters)"
            required
            minLength={8}
            disabled={isLoading}
          />
        </div>
        <input name="flow" type="hidden" value="signUp" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}
