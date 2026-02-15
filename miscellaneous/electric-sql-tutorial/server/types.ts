import type { User } from "../drizzle/schema";

// Extend Hono context with typed variables
export type Variables = {
  user: User;
  token: string;
};
