import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import { generateToken } from "./jwt";
import { authMiddleware } from "./middleware";
import type { Variables } from "../types";

const auth = new Hono<{ Variables: Variables }>();

// Sign Up
auth.post("/signup", async (c) => {
  try {
    const { username, password, name } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ error: "Username already exists" }, 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db
      .insert(schema.users)
      .values({
        username: username.toLowerCase(),
        passwordHash,
        name: name || null,
      })
      .returning();

    const user = newUser[0];

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(schema.sessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    return c.json({ token, userId: user.id });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Signup failed" }, 500);
  }
});

// Sign In
auth.post("/signin", async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    // Find user
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username.toLowerCase()))
      .limit(1);

    if (users.length === 0) {
      return c.json({ error: "Invalid username or password" }, 401);
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return c.json({ error: "Invalid username or password" }, 401);
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(schema.sessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    return c.json({ token, userId: user.id });
  } catch (error) {
    console.error("Signin error:", error);
    return c.json({ error: "Signin failed" }, 500);
  }
});

// Sign Out
auth.post("/signout", async (c) => {
  try {
    const { token } = await c.req.json();

    if (!token) {
      return c.json({ error: "Token is required" }, 400);
    }

    // Delete session
    await db.delete(schema.sessions).where(eq(schema.sessions.token, token));

    return c.json({ ok: true });
  } catch (error) {
    console.error("Signout error:", error);
    return c.json({ error: "Signout failed" }, 500);
  }
});

// Get Current User
auth.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");

  return c.json({
    id: user.id,
    username: user.username,
    name: user.name,
  });
});

export default auth;
