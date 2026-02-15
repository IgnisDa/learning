#!/bin/sh
set -eu

export ELECTRIC_INSECURE=true

frontend_command='PORT=3000 node .output/server/index.mjs'
backend_command='/app/bin/entrypoint start'

exec concurrently --names frontend,backend --kill-others \
  "$frontend_command" \
  "$backend_command"
