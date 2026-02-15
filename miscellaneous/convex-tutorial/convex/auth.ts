import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export const signUp = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("username", (q) =>
        q.eq("username", args.username.toLowerCase()),
      )
      .first();

    if (existingUser) throw new Error("Username already exists");

    const passwordHash = bcrypt.hashSync(args.password, 10);

    const userId = await ctx.db.insert("users", {
      passwordHash,
      name: args.name,
      username: args.username.toLowerCase(),
    });

    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", { token, userId, expiresAt });

    return { token, userId };
  },
});

export const signIn = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) =>
        q.eq("username", args.username.toLowerCase()),
      )
      .first();

    if (!user) throw new Error("Invalid username or password");

    const isValid = bcrypt.compareSync(args.password, user.passwordHash);

    if (!isValid) throw new Error("Invalid username or password");

    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("sessions", { token, expiresAt, userId: user._id });

    return { token, userId: user._id };
  },
});

export const signOut = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", args.token))
      .first();

    if (session) await ctx.db.delete(session._id);
  },
});

export const getAuthenticatedUserId = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) throw new Error("Not authenticated");

    const token = args.token;

    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", token))
      .first();

    if (!session || session.expiresAt < Date.now())
      throw new Error("Not authenticated");

    return session.userId;
  },
});
