import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  format: ["esm"],
  platform: "node",
  target: "node22",
  splitting: false,
  outDir: "server/dist",
  entry: ["server/index.ts"],
});
