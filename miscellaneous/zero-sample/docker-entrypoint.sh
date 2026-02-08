#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ] && [ -z "${ZERO_UPSTREAM_DB:-}" ]; then
	printf '%s\n' "DATABASE_URL or ZERO_UPSTREAM_DB must be set" >&2
	exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
	DATABASE_URL="$ZERO_UPSTREAM_DB"
	export DATABASE_URL
fi

if [ -z "${ZERO_UPSTREAM_DB:-}" ]; then
	ZERO_UPSTREAM_DB="$DATABASE_URL"
	export ZERO_UPSTREAM_DB
fi

: "${ZERO_QUERY_URL:=http://127.0.0.1:3001/api/zero/query}"
export ZERO_QUERY_URL

: "${ZERO_MUTATE_URL:=http://127.0.0.1:3001/api/zero/mutate}"
export ZERO_MUTATE_URL

: "${ZERO_QUERY_FORWARD_COOKIES:=true}"
export ZERO_QUERY_FORWARD_COOKIES

: "${ZERO_MUTATE_FORWARD_COOKIES:=true}"
export ZERO_MUTATE_FORWARD_COOKIES

: "${ZERO_REPLICA_FILE:=/data/zero.db}"
export ZERO_REPLICA_FILE

: "${ZERO_PORT:=4848}"
export ZERO_PORT

if [ "${NODE_ENV:-production}" = "production" ] && [ -z "${ZERO_ADMIN_PASSWORD:-}" ]; then
	printf '%s\n' "ZERO_ADMIN_PASSWORD is required when NODE_ENV=production" >&2
	exit 1
fi

exec npm run start:container
