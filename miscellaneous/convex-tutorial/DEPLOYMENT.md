# Deployment Guide

## Docker Deployment (Single-Container)

This project can be deployed as a single container on port `3000` with:

- React app served as static files by Caddy
- Self-hosted Convex backend
- Convex HTTP actions proxy

The Convex dashboard is intentionally **not** included.

### Routes

- App: `http://localhost:3000/`
- Convex API + sync: `http://localhost:3000` (proxied to backend)
- Convex site proxy: `http://localhost:3000/_site/`
- Convex dashboard: disabled (`/_dashboard` returns 404)

### Auto Deploy on Startup

At container startup, the entrypoint:

1. Starts Convex backend
2. Waits for backend readiness
3. Generates an admin key
4. Configures environment variables:
   - Auth: `JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL` (auto-generated)
   - App: `TMDB_API_KEY` (synced from host environment if set)
5. Runs `npm exec -- convex deploy --yes`
6. Starts Caddy

If deploy fails, container startup fails (fail-fast behavior).

**Authentication is automatically configured** - users can immediately sign up and log in without any manual setup.

### Run with Docker Compose

Create a `docker-compose.yml` file:

```yaml
services:
  convex-tutorial:
    build:
      context: .
      dockerfile: deployment/Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - convex-data:/convex/data
    environment:
      - CONVEX_CLOUD_ORIGIN=http://localhost:3000
      - CONVEX_SITE_ORIGIN=http://localhost:3000/_site
      - CONVEX_AUTO_DEPLOY=1
      - TMDB_API_KEY=${TMDB_API_KEY:-}

volumes:
  convex-data:
```

Then run:

```bash
docker compose up --build
```

To reset everything:

```bash
docker compose down -v
```

### Environment Variables

**Docker/Deployment:**

- `CONVEX_CLOUD_ORIGIN` (default: `http://localhost:3000`)
- `CONVEX_SITE_ORIGIN` (default: `http://localhost:3000/_site`)
- `CONVEX_AUTO_DEPLOY` (default: `1`; set `0` to disable auto-deploy)
- `DO_NOT_REQUIRE_SSL` (optional for local dev)
- `DISABLE_BEACON` (optional telemetry disable)

**Application (synced to Convex automatically):**

- `TMDB_API_KEY` - Your TMDB API key for movie data (optional, but required for movie features)

These variables are automatically synced to Convex at startup via `scripts/setup-env.mjs`. The script loads variables from:

1. `.env`
2. Shell environment variables

### Notes

- `.env.local` is excluded from Docker build context via `.dockerignore`.
- Persistent data (DB + storage) lives under `/convex/data`.
- Environment variables are stored in the Convex deployment and persist across restarts.
