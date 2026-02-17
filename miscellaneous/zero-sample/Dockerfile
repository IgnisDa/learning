FROM node:22.12.0-bookworm-slim AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

COPY . .
RUN yarn run frontend:build

FROM node:22.12.0-bookworm-slim AS prod-deps

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn workspaces focus --production

FROM node:22.12.0-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends wget ca-certificates procps \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=caddy:2.9.1 /usr/bin/caddy /usr/local/bin/caddy

COPY --from=builder /app/package.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/Caddyfile ./Caddyfile
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p /data \
	&& chmod +x /usr/local/bin/docker-entrypoint.sh \
	&& groupadd -r appuser \
	&& useradd -r -g appuser appuser \
	&& chown -R appuser:appuser /app /data

USER appuser

CMD ["/usr/local/bin/docker-entrypoint.sh"]
