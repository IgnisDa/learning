import { Context, Next } from "hono";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return c.json({ error: "No token provided" }, 401);
  }

  // Check if session exists and is valid
  const session = await db
    .select()
    .from(schema.sessions)
    .where(eq(schema.sessions.token, token))
    .limit(1);

  if (!session || session.length === 0) {
    return c.json({ error: "Invalid token" }, 401);
  }

  const sessionData = session[0];

  // Check if session has expired
  if (new Date(sessionData.expiresAt) < new Date()) {
    return c.json({ error: "Token expired" }, 401);
  }

  // Get user data
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, sessionData.userId))
    .limit(1);

  if (!user || user.length === 0) {
    return c.json({ error: "User not found" }, 401);
  }

  // Attach user to context
  c.set("user", user[0]);
  c.set("token", token);

  await next();
}
