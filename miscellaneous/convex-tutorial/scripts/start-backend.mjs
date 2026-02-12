#!/usr/bin/env node
import { execFileSync, spawn } from "child_process";
import process from "process";

console.log("🚀 Starting Convex backend...\n");

const isWindows = process.platform === "win32";
const npxCommand = isWindows ? "npx.cmd" : "npx";
const yarnCommand = isWindows ? "yarn.cmd" : "yarn";
let shuttingDown = false;
let shutdownExitCode = 0;

// Start Convex dev
const backend = spawn(npxCommand, ["convex", "dev"], {
  stdio: "inherit",
  detached: !isWindows,
});

const isAlive = () => backend.exitCode === null && backend.signalCode === null;

const killBackend = (signal) => {
  if (!backend.pid || !isAlive()) return;

  if (isWindows) {
    backend.kill(signal);
    return;
  }

  try {
    process.kill(-backend.pid, signal);
  } catch {
    try {
      backend.kill(signal);
    } catch {
      // Ignore follow-up failures during shutdown.
    }
  }
};

const shutdown = (exitCode) => {
  if (shuttingDown) return;
  shuttingDown = true;
  shutdownExitCode = exitCode;

  killBackend("SIGTERM");
  setTimeout(() => {
    killBackend("SIGKILL");
    process.exit(shutdownExitCode);
  }, 1000).unref();
};

// Wait for backend to be ready
let attempts = 0;
const maxAttempts = 30;

const checkBackend = async () => {
  while (!shuttingDown && attempts < maxAttempts) {
    try {
      const response = await fetch("http://127.0.0.1:3210/version", {
        signal: AbortSignal.timeout(1000),
      });
      if (!response.ok)
        throw new Error(`Unexpected status code: ${response.status}`);

      console.log("\n✅ Backend is ready! Checking environment...\n");

      // Run environment setup (auth + app env vars)
      try {
        execFileSync(yarnCommand, ["run", "setup-env"], { stdio: "inherit" });
      } catch (error) {
        console.error("\n⚠️  Environment setup failed, but continuing...\n");
      }

      return;
    } catch (e) {
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (shuttingDown) return;

  console.error("\n❌ Backend failed to start\n");
  shutdown(1);
};

// Start checking after a brief delay
setTimeout(() => {
  void checkBackend();
}, 2000);

// Handle cleanup
process.on("SIGINT", () => {
  shutdown(0);
});

process.on("SIGTERM", () => {
  shutdown(0);
});

process.on("SIGHUP", () => {
  shutdown(0);
});

process.on("exit", () => {
  killBackend("SIGTERM");
});

backend.on("error", (error) => {
  if (shuttingDown) return;

  console.error("\n❌ Failed to start Convex backend:\n", error.message);
  shutdown(1);
});

backend.on("exit", (code) => {
  if (shuttingDown) process.exit(shutdownExitCode);

  process.exit(code ?? 1);
});
