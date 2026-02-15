#!/bin/sh
set -eu

export ELECTRIC_PORT="3001"
export ELECTRIC_INSECURE="true"
export ELECTRIC_URL="http://localhost:3001"
export BETTER_AUTH_SECRET="postgresql_postgres_password_localhost_electric"

backend_command="/app/bin/entrypoint start"
frontend_command="node .output/server/index.mjs"

exec concurrently --names frontend,backend --kill-others \
  "$frontend_command" \
  "$backend_command"
