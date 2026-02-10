import { useAuthActions } from "@convex-dev/auth/react";
import { useState, FormEvent } from "react";

interface SignUpProps {
  onToggle: () => void;
}

export function SignUp({ onToggle }: SignUpProps) {
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
    <div>
      <h2>Sign Up</h2>
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
        <button type="button" onClick={onToggle} disabled={isLoading}>
          Sign in
        </button>
      </p>
    </div>
  );
}
