import { defineApp } from "convex/server";
import workpool from "@convex-dev/workpool/convex.config.js";

const app = defineApp();
app.use(workpool, { name: "tmdbWorkpool" });

export default app;
