import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { SignJWT, importPKCS8 } from "jose";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalQuery, mutation, query } from "./_generated/server";

async function generateJWT(userId: string): Promise<string> {
  const privateKeyPem = process.env.JWT_PRIVATE_KEY;
  if (!privateKeyPem)
    throw new Error("JWT_PRIVATE_KEY environment variable is not set");

  const formattedKey = privateKeyPem.replace(/\|/g, "\n");
  const privateKey = await importPKCS8(formattedKey, "RS256");

  const jwt = await new SignJWT({
    sub: userId,
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer("convex-tutorial")
    .setAudience("convex-tutorial")
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(privateKey);

  return jwt;
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

    const token = await generateJWT(userId);
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const tokenIdentifier = `convex-tutorial|${userId}`;

    await ctx.db.insert("sessions", {
      userId,
      expiresAt,
      token: tokenIdentifier,
    });

    return { token, userId };
  },
});

export const signIn = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
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

    const token = await generateJWT(user._id);
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const tokenIdentifier = `convex-tutorial|${user._id}`;

    await ctx.db.insert("sessions", {
      expiresAt,
      userId: user._id,
      token: tokenIdentifier,
    });

    return { token, userId: user._id };
  },
});

export const signOut = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", identity.tokenIdentifier))
      .first();

    if (session) await ctx.db.delete(session._id);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", identity.tokenIdentifier))
      .first();

    if (!session) return null;

    if (session.expiresAt < Date.now()) return null;

    const user = await ctx.db.get(session.userId);

    if (!user) return null;

    return { _id: user._id, name: user.name, username: user.username };
  },
});

export const getAuthenticatedUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", identity.tokenIdentifier))
      .first();

    if (!session || session.expiresAt < Date.now())
      throw new Error("Not authenticated");

    return session.userId;
  },
});

export const getUserIdFromIdentity = internalQuery({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("token", (q) => q.eq("token", args.tokenIdentifier))
      .first();

    if (!session || session.expiresAt < Date.now()) return null;

    return session.userId;
  },
});

export async function getUserIdFromAuth(ctx: {
  auth: { getUserIdentity: () => Promise<any> };
  runQuery?: any;
}): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  if (!ctx.runQuery) return null;

  const userId = await ctx.runQuery(internal.auth.getUserIdFromIdentity, {
    tokenIdentifier: identity.tokenIdentifier,
  });

  return userId;
}
