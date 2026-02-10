FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY . .
RUN yarn build

FROM ghcr.io/get-convex/convex-backend:latest AS runtime
WORKDIR /app
COPY --from=caddy:2.9.1 /usr/bin/caddy /usr/local/bin/caddy
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/convex /app/convex
COPY --from=builder /app/scripts /app/scripts
COPY --from=builder /app/tsconfig.json /app/tsconfig.json
COPY --from=builder /app/dist/client /app/dist
COPY deployment/Caddyfile /etc/caddy/Caddyfile
COPY deployment/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENV CONVEX_AUTO_DEPLOY=1
ENV CONVEX_CLOUD_ORIGIN=http://localhost:3000
ENV CONVEX_SITE_ORIGIN=http://localhost:3000/_site
EXPOSE 3000
VOLUME ["/convex/data"]
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
