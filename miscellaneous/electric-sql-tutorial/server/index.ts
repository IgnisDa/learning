import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./auth/routes";
import queries from "./queries/routes";
import tmdb from "./tmdb/routes";
import type { Variables } from "./types";

// Load environment variables
config({ path: ".env.local" });

const app = new Hono<{ Variables: Variables }>();

// CORS middleware
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  }),
);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Mount routes
app.route("/api/auth", auth);
app.route("/api/tmdb", tmdb);
app.route("/api/queries", queries);

// 404 handler
app.notFound((c) => c.json({ error: "Not found" }, 404));

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

const port = parseInt(process.env.API_PORT || "3002");

console.log(`🚀 Server running on http://localhost:${port}`);

serve({ port, fetch: app.fetch });
