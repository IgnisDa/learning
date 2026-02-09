# Convex Tutorial (Single-Container Docker)

This project runs as a single container on port `3000` with:

- React app served as static files by Caddy
- Self-hosted Convex backend
- Convex HTTP actions proxy

The Convex dashboard is intentionally **not** included.

## Routes

- App: `http://localhost:3000/`
- Convex API + sync: `http://localhost:3000` (proxied to backend)
- Convex site proxy: `http://localhost:3000/_site/`
- Convex dashboard: disabled (`/_dashboard` returns 404)

## Auto Deploy on Startup

At container startup, the entrypoint:

1. Starts Convex backend
2. Waits for backend readiness
3. Generates an admin key
4. Runs `npm exec -- convex deploy --yes`
5. Starts Caddy

If deploy fails, container startup fails (fail-fast behavior).

## Run with Docker Compose

Use the compose file at `/tmp/convex-tutorial-docker/docker-compose.yml`:

```bash
cd /tmp/convex-tutorial-docker
docker compose up --build
```

To reset everything:

```bash
cd /tmp/convex-tutorial-docker
docker compose down -v
```

## Key Environment Variables

- `CONVEX_CLOUD_ORIGIN` (default: `http://localhost:3000`)
- `CONVEX_SITE_ORIGIN` (default: `http://localhost:3000/_site`)
- `CONVEX_AUTO_DEPLOY` (default: `1`; set `0` to disable auto-deploy)
- `DO_NOT_REQUIRE_SSL` (optional for local dev)
- `DISABLE_BEACON` (optional telemetry disable)

## Notes

- `.env.local` is excluded from Docker build context via `.dockerignore`.
- Persistent data (DB + storage) lives under `/convex/data`.
