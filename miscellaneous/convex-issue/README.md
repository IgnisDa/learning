# Convex Self-Hosted OCC Repro

This repository reproduces OCC conflicts in self-hosted Convex using a single
`/wiki pokemon` chat command.

The repro intentionally uses:

- `@convex-dev/workflow` + `@convex-dev/workpool`
- `startAsync: true` workflow start
- workpool `maxParallelism: 5`
- workflow workpool options `maxParallelism: 5`

## Prerequisites

- Node.js 20+
- Docker + Docker Compose

## 1) Start self-hosted Convex

From this directory:

```bash
docker compose up -d
```

Generate an admin key:

```bash
docker compose exec backend ./generate_admin_key.sh
```

Save the key and export env vars for CLI commands:

```bash
export CONVEX_SELF_HOSTED_URL="http://127.0.0.1:3210"
export CONVEX_SELF_HOSTED_ADMIN_KEY="<PASTE_ADMIN_KEY_HERE>"
```

## 2) Install deps and deploy functions

```bash
npm install
npx convex dev --once
```

## 3) Run the frontend

```bash
npm run dev:frontend
```

Open the app URL printed by Vite (usually `http://127.0.0.1:5173`).

## 4) Reproduce the issue

In one terminal, tail backend logs:

```bash
docker compose logs -f backend
```

In the app, send exactly one message:

```text
/wiki pokemon
```

You should see OCC errors in backend logs for internal workflow/workpool tables,
typically including `runStatus` and/or `pendingCompletion`.

## Notes

- Relevant implementation is in `convex/chat.ts`.
- Docker setup is in `docker-compose.yml`.
- If you set `SCHEDULED_JOB_EXECUTION_PARALLELISM=1` for backend, the issue is
  often mitigated, but this serializes scheduled job execution.
