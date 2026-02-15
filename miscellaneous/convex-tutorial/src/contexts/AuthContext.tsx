import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useConvex, useQuery } from "convex/react";
import { createContext, useCallback, useEffect, useState } from "react";
import { getCookie, removeCookie, setCookie } from "../utils/cookies";

const AUTH_TOKEN_KEY = "convex_auth_token";

interface User {
  name?: string;
  _id: Id<"users">;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  signOut: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, name?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") return getCookie(AUTH_TOKEN_KEY);
    return null;
  });

  const convex = useConvex();
  const user = useQuery(api.auth.getCurrentUser, token ? { token } : "skip");
  const isLoading = token ? user === undefined : false;

  useEffect(() => {
    if (token) setCookie(AUTH_TOKEN_KEY, token);
    else removeCookie(AUTH_TOKEN_KEY);
  }, [token]);

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
    if (token) await convex.mutation(api.auth.signOut, { token });
    setToken(null);
  }, [convex, token]);

  return (
    <AuthContext.Provider
      value={{ token, signIn, signUp, signOut, isLoading, user: user ?? null }}
    >
      {children}
    </AuthContext.Provider>
  );
}
