FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY . .
RUN yarn build

FROM ghcr.io/get-convex/convex-backend:4ef979bd2092596726da3ad9d13decc5b3ad2aea AS runtime
WORKDIR /app
RUN npm install -g yarn@1.22.22
COPY --from=caddy:2.10.2 /usr/bin/caddy /usr/local/bin/caddy
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
ENV CONVEX_CLOUD_ORIGIN=http://localhost:3000
ENV CONVEX_SITE_ORIGIN=http://localhost:3000/_site
EXPOSE 3000
VOLUME ["/convex/data"]
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
