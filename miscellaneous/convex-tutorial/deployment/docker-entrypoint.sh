#!/usr/bin/env bash
set -euo pipefail

export CONVEX_CLOUD_ORIGIN="${CONVEX_CLOUD_ORIGIN:-http://localhost:3000}"
export CONVEX_SITE_ORIGIN="${CONVEX_SITE_ORIGIN:-http://localhost:3000/_site}"

if [ -n "${DATABASE_URL:-}" ]; then
  POSTGRES_URL=$(echo "$DATABASE_URL" | sed -E 's/\/[^/]+(\?.*)?$//')
  export POSTGRES_URL
  INSTANCE_NAME=$(echo "$DATABASE_URL" | sed -E 's/.*\/([^/?]+)(\?.*)?$/\1/')
  export INSTANCE_NAME
  echo "Values:" "$POSTGRES_URL" "$INSTANCE_NAME"
fi

echo "Starting Convex backend..."
(
  cd /convex
  ./run_backend.sh
) &
BACKEND_PID=$!

cleanup() {
  if kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
}

trap cleanup INT TERM EXIT

echo "Waiting for Convex backend to be ready..."
until curl -fsS http://127.0.0.1:3210/version >/dev/null 2>&1; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "Convex backend exited before becoming ready" >&2
    wait "$BACKEND_PID"
    exit 1
  fi
  sleep 1
done

ADMIN_KEY="$(cd /convex && ./generate_admin_key.sh)"

echo "Setting up Convex environment variables..."
export CONVEX_SELF_HOSTED_URL="http://127.0.0.1:3210"
export CONVEX_SELF_HOSTED_ADMIN_KEY="$ADMIN_KEY"
unset CONVEX_DEPLOYMENT || true
(
  cd /app
  node scripts/setup-env.mjs
)
echo "Environment variables configured."

echo ""
echo "============================================"
echo "Admin Key (save this for CLI):"
echo "$ADMIN_KEY"
echo "============================================"
echo ""

echo "Deploying Convex functions..."
export CONVEX_SELF_HOSTED_URL="http://127.0.0.1:3210"
export CONVEX_SELF_HOSTED_ADMIN_KEY="$ADMIN_KEY"
unset CONVEX_DEPLOYMENT || true
(
  cd /app
  yarn exec -- convex deploy --yes
)
echo "Convex functions deployed successfully."

echo "Starting frontend SSR server..."
FRONTEND_PORT="${FRONTEND_PORT:-3001}"
PORT="$FRONTEND_PORT" NITRO_PORT="$FRONTEND_PORT" node .output/server/index.mjs &
echo "Starting Caddy reverse proxy..."
echo ""
echo "============================================"
echo "Services available at:"
echo "  - App:       http://localhost:3000"
echo "  - Backend:   http://localhost:3000/api"
echo "  - HTTP Actions: http://localhost:3000/_site/"
echo "============================================"
echo ""

trap - EXIT
exec /usr/local/bin/caddy run --config /etc/caddy/Caddyfile
