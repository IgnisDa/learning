#!/bin/sh
set -eu

export ELECTRIC_PORT="3001"
export ELECTRIC_INSECURE="true"
export BETTER_AUTH_SECRET="postgresql_postgres_password_localhost_electric"

frontend_command='PORT=3000 node .output/server/index.mjs'
backend_command='/app/bin/entrypoint start'

exec concurrently --names frontend,backend --kill-others \
  "$frontend_command" \
  "$backend_command"
