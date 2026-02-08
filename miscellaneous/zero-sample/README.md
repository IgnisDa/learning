# Zero + TanStack Start TMDB POC

POC app that demonstrates:

- TanStack Start app + Zero client (instant UI reads/writes)
- Postgres as the source of truth
- `zero-cache` replicating Postgres -> SQLite and syncing queried rows to the browser
- A background worker that calls TMDB (multiple endpoints) and updates the database
- Cookie-based auth (zero-cache forwards cookies to query/mutate)

## What you'll run

- App server: `npm run dev` (http://localhost:3000)
- Zero cache: `npx zero-cache-dev` (http://localhost:4848)
- Worker: `npm run worker`

## Docker (single container)

This container runs all required processes together:

- app server (TanStack Start)
- `zero-cache`
- TMDB worker (`npm run worker`)
- Caddy reverse proxy (single public port)

At startup it waits for Postgres, then runs `db/init.sql`.

Use this `docker-compose.yml` (from this folder):

```yaml
services:
  upstream-db:
    image: postgres:18
    environment:
      POSTGRES_DB: zero
      POSTGRES_PASSWORD: pass
    ports:
      - "5432:5432"
    command: postgres -c wal_level=logical
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d zero"]
      interval: 5s
      timeout: 5s
      retries: 20

  zero-sample:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      upstream-db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://postgres:pass@upstream-db:5432/zero
      TMDB_API_KEY: <your_tmdb_key>
      ZERO_ADMIN_PASSWORD: <set-a-strong-password>
      ZERO_APP_ID: zero_sample
      ZERO_REPLICA_FILE: /data/zero.db
    ports:
      - "3000:3000"
    volumes:
      - zero-sample-data:/data

volumes:
  zero-sample-data:
```

Then run:

```sh
docker compose up --build
```

Open http://localhost:3000.

`zero-cache` is available behind Caddy at `/_zero` on the same host/port.

## Setup

Requirements:

- Node >= 22.12.0
- Postgres with `wal_level=logical` (for `zero-cache`)

1) Fill env vars in `.env`

- `DATABASE_URL`
- `TMDB_API_KEY` (either a v3 API key or a v4 "API Read Access Token")
- `ZERO_UPSTREAM_DB` (set it to the same value as `DATABASE_URL`)
- `ZERO_ADMIN_PASSWORD` (required by `zero-cache` when `NODE_ENV=production`)

Note: this app expects cookie auth forwarding to be enabled in `zero-cache`:

- `ZERO_QUERY_FORWARD_COOKIES=true`
- `ZERO_MUTATE_FORWARD_COOKIES=true`

2) Create tables

Run `db/init.sql` against your Postgres DB.

Example:

```sh
psql "$DATABASE_URL" -f db/init.sql
```

3) Install deps

```sh
npm install
```

## Run

Terminal 1 (app):

```sh
npm run dev
```

Terminal 2 (zero-cache):

```sh
set -a
source .env
set +a
npx zero-cache-dev
```

Terminal 3 (worker):

```sh
npm run worker
```

Open http://localhost:3000.

## How it works

1) Login (`/api/auth/login`) sets an HttpOnly cookie (session)
2) Browser sends that cookie to `zero-cache` (same host, different port)
3) `zero-cache` forwards cookies to `/api/zero/query` + `/api/zero/mutate`
4) Search hits `/api/tmdb/search` (server route; uses `TMDB_API_KEY`)
5) Clicking “Add” runs a Zero mutator:
   - upserts `user_show` (per-user library)
   - upserts `show` (global TMDB show row)
   - enqueues an `outbox` job when enrichment is needed
6) Worker claims pending `outbox` jobs, calls TMDB:
   - `/tv/{id}`
   - `/tv/{id}/credits`
   - `/tv/{id}/season/{n}` for each season
7) Worker writes `season`, `person`, `credit`, updates `show.enrich_state`
8) Those Postgres updates replicate to `zero-cache` and stream to your browser queries
