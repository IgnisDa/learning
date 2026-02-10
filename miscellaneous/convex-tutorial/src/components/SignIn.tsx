import { useAuthActions } from "@convex-dev/auth/react";
import { useState, FormEvent } from "react";

interface SignInProps {
  onToggle: () => void;
}

export function SignIn({ onToggle }: SignInProps) {
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
    <div>
      <h2>Sign In</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
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
        <button type="button" onClick={onToggle} disabled={isLoading}>
          Sign up
        </button>
      </p>
    </div>
  );
}
