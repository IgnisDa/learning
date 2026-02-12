#!/usr/bin/env node
import { spawn } from "child_process";
import process from "process";

const isWindows = process.platform === "win32";
const yarnCommand = isWindows ? "yarn.cmd" : "yarn";

const services = [
  { name: "proxy", args: ["run", "dev:proxy"] },
  { name: "backend", args: ["run", "dev:backend"] },
  { name: "frontend", args: ["run", "dev:frontend"] },
  {
    name: "typecheck",
    args: ["run", "typecheck", "--watch", "--preserveWatchOutput"],
  },
];

const children = [];
let shuttingDown = false;

const isAlive = (child) => child.exitCode === null && child.signalCode === null;

const killTree = (child, signal) => {
  if (!child.pid || !isAlive(child)) return;

  if (isWindows) {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
    });
    return;
  }

  try {
    process.kill(-child.pid, signal);
  } catch {
    try {
      child.kill(signal);
    } catch {
      // Ignore follow-up failures during shutdown.
    }
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shutdown = async (exitCode) => {
  if (shuttingDown) return;

  shuttingDown = true;

  for (const child of children) {
    killTree(child, "SIGTERM");
  }

  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    if (children.every((child) => !isAlive(child))) process.exit(exitCode);
    await sleep(50);
  }

  for (const child of children) killTree(child, "SIGKILL");

  process.exit(exitCode);
};

for (const service of services) {
  const child = spawn(yarnCommand, service.args, {
    env: process.env,
    detached: !isWindows,
    stdio: ["ignore", "inherit", "inherit"],
  });

  child.on("error", (error) => {
    if (shuttingDown) return;
    console.error(`Failed to start ${service.name}:`, error.message);
    void shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;

    const exitCode = code ?? (signal ? 1 : 0);
    if (exitCode !== 0)
      console.error(`${service.name} exited with code ${exitCode}.`);

    void shutdown(exitCode);
  });

  children.push(child);
}

process.on("SIGINT", () => {
  void shutdown(0);
});

process.on("SIGTERM", () => {
  void shutdown(0);
});

process.on("SIGHUP", () => {
  void shutdown(0);
});

process.on("uncaughtException", (error) => {
  console.error(error);
  void shutdown(1);
});

process.on("unhandledRejection", (error) => {
  console.error(error);
  void shutdown(1);
});

process.on("exit", () => {
  for (const child of children) {
    killTree(child, "SIGTERM");
  }
});
