#!/usr/bin/env node

import { execSync } from "child_process";
import { config } from "dotenv";

config({ path: ".env.local" });

// Environment variables to sync from process.env to Convex
// These are required and must be present in the local environment
const SYNC_FROM_ENV = ["TMDB_API_KEY"];

// Check for missing required env vars
const missingRequired = SYNC_FROM_ENV.filter((v) => !process.env[v]);
if (missingRequired.length > 0) {
  console.error(
    `Missing required environment variables: ${missingRequired.join(", ")}`,
  );
  process.exit(1);
}

console.log("Checking Convex environment variables...\n");

// Get current environment variables from Convex
let currentEnv = {};
try {
  const output = execSync("npx convex env list", { encoding: "utf-8" });
  if (output.includes("No environment variables set.")) {
    console.log("No environment variables found in Convex.");
  } else {
    // Parse the output
    output.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=/);
      if (match) {
        currentEnv[match[1]] = true;
      }
    });
  }
} catch (error) {
  console.error("Failed to check environment variables:", error.message);
  process.exit(1);
}

// Check which env vars should be synced (present in process.env but not in Convex)
const varsToSync = SYNC_FROM_ENV.filter(
  (v) => process.env[v] && !currentEnv[v],
);

if (varsToSync.length === 0) {
  console.log("All required environment variables are set!\n");
  process.exit(0);
}

if (varsToSync.length > 0) {
  console.log(`Environment variables to sync: ${varsToSync.join(", ")}`);
}
console.log("\nSetting up environment variables...\n");

// Sync environment variables from local env to Convex
for (const varName of varsToSync) {
  const value = process.env[varName];
  try {
    execSync(`npx convex env set ${varName} "${value}"`, { stdio: "inherit" });
    console.log(`Set ${varName} from local environment`);
  } catch (error) {
    console.error(`Failed to set ${varName}`);
    process.exit(1);
  }
}

console.log("\nEnvironment setup complete!\n");
