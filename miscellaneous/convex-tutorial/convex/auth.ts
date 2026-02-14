import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});

export const getAuthenticatedUserId = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return userId;
  },
});
