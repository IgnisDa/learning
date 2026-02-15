import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useConvex, useQuery } from "convex/react";
import { createContext, useCallback, useEffect, useState } from "react";

const AUTH_TOKEN_KEY = "convex_auth_token";

interface User {
  name?: string;
  _id: Id<"users">;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, name?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem(AUTH_TOKEN_KEY);
    return null;
  });

  const convex = useConvex();
  const user = useQuery(api.auth.getCurrentUser);
  const isLoading = user === undefined;

  useEffect(() => {
    const setupAuth = async () => {
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        convex.setAuth(async () => token);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        convex.setAuth(async () => null);
      }
    };
    setupAuth();
  }, [token, convex]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      const result = await convex.mutation(api.auth.signIn, {
        username,
        password,
      });
      setToken(result.token);
    },
    [convex],
  );

  const signUp = useCallback(
    async (username: string, password: string, name?: string) => {
      const result = await convex.mutation(api.auth.signUp, {
        name,
        username,
        password,
      });
      setToken(result.token);
    },
    [convex],
  );

  const signOut = useCallback(async () => {
    await convex.mutation(api.auth.signOut);
    setToken(null);
  }, [convex]);

  return (
    <AuthContext.Provider
      value={{ signIn, signUp, signOut, isLoading, user: user ?? null }}
    >
      {children}
    </AuthContext.Provider>
  );
}
