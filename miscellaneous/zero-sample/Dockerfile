FROM node:22.12.0-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

FROM node:22.12.0-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends wget curl ca-certificates procps \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=caddy:2.9.1 /usr/bin/caddy /usr/local/bin/caddy

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/db ./db
COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN mkdir -p /data && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

VOLUME ["/data"]

CMD ["/usr/local/bin/docker-entrypoint.sh"]
