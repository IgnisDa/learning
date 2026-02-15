import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/tv_tracker";

// Create the connection
const client = postgres(connectionString);

// Create the Drizzle database instance
export const db = drizzle(client, { schema });

// Export schema for use in queries
export { schema };
