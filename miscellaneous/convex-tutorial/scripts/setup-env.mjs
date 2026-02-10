#!/usr/bin/env node
import { execSync } from "child_process";
import { config } from "dotenv";
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

config({ path: ".env" });

// Auth-related variables that are auto-generated
const AUTH_VARS = ["JWT_PRIVATE_KEY", "JWKS", "SITE_URL"];

// Environment variables to sync from process.env to Convex
// These are optional - only synced if present in the local environment
const SYNC_FROM_ENV = ["TMDB_API_KEY"];

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

// Check which auth variables are missing
const missingAuthVars = AUTH_VARS.filter((v) => !currentEnv[v]);

// Check which env vars should be synced (present in process.env but not in Convex)
const varsToSync = SYNC_FROM_ENV.filter(
  (v) => process.env[v] && !currentEnv[v],
);

if (missingAuthVars.length === 0 && varsToSync.length === 0) {
  console.log("All required environment variables are set!\n");
  process.exit(0);
}

if (missingAuthVars.length > 0) {
  console.log(`Missing auth variables: ${missingAuthVars.join(", ")}`);
}
if (varsToSync.length > 0) {
  console.log(`Environment variables to sync: ${varsToSync.join(", ")}`);
}
console.log("\nSetting up environment variables...\n");

// Generate keys if needed
if (
  missingAuthVars.includes("JWT_PRIVATE_KEY") ||
  missingAuthVars.includes("JWKS")
) {
  console.log("Generating JWT keys...");

  const keys = await generateKeyPair("RS256", { extractable: true });
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

  if (missingAuthVars.includes("JWT_PRIVATE_KEY")) {
    const jwtKey = privateKey.trimEnd().replace(/\n/g, " ");
    try {
      execSync(`npx convex env set -- JWT_PRIVATE_KEY "${jwtKey}"`, {
        stdio: "inherit",
      });
      console.log("Set JWT_PRIVATE_KEY");
    } catch (error) {
      console.error("Failed to set JWT_PRIVATE_KEY");
      process.exit(1);
    }
  }

  if (missingAuthVars.includes("JWKS")) {
    try {
      execSync(`npx convex env set -- JWKS '${jwks}'`, { stdio: "inherit" });
      console.log("Set JWKS");
    } catch (error) {
      console.error("Failed to set JWKS");
      process.exit(1);
    }
  }
}

// Set SITE_URL if missing
if (missingAuthVars.includes("SITE_URL")) {
  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  try {
    execSync(`npx convex env set SITE_URL "${siteUrl}"`, { stdio: "inherit" });
    console.log(`Set SITE_URL to ${siteUrl}`);
  } catch (error) {
    console.error("Failed to set SITE_URL");
    process.exit(1);
  }
}

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
