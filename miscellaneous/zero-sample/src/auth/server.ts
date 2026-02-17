import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import "~/config/env";
import * as authSchema from "~/db/auth-schema";
import { sql } from "~/lib/db";

const db = drizzle(sql, { schema: authSchema });

const baseURL =
  process.env.BETTER_AUTH_BASE_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000/api/auth";

export const auth = betterAuth({
  baseURL,
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  advanced: process.env.COOKIE_DOMAIN
    ? {
        crossSubDomainCookies: {
          enabled: true,
          domain: process.env.COOKIE_DOMAIN,
        },
      }
    : undefined,
});

export type Session = {
  email: string;
  userID: string;
};

export async function getSession(request: Request): Promise<Session | null> {
  const authSession = await auth.api.getSession(request);
  if (!authSession?.user) {
    return null;
  }

  const email = authSession.user.email;
  const userID = authSession.user.id;

  return { email, userID };
}
