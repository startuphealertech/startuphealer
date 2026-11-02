# syntax=docker/dockerfile:1
# Build context = repository ROOT (monorepo uses one shared package-lock.json)
#   docker build -f api/Dockerfile -t startuphealer-api .
#
# Targets:
#   development -> used by docker-compose.yml (hot reload with node --watch)
#   production  -> used by Render and docker-compose.staging.yml (default/last stage)

ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false
COPY package.json package-lock.json ./
COPY api/package.json ./api/package.json
COPY web/package.json ./web/package.json

# ---------- development ----------
FROM base AS development
ENV NODE_ENV=development
RUN npm ci --workspace=api --include-workspace-root=false
COPY api ./api
WORKDIR /app/api
EXPOSE 5000
CMD ["node", "--watch", "src/server.js"]

# ---------- production deps ----------
FROM base AS prod-deps
RUN npm ci --workspace=api --include-workspace-root=false --omit=dev && mkdir -p api/node_modules && npm cache clean --force

# ---------- production ----------
FROM node:${NODE_VERSION} AS production
ENV NODE_ENV=production PORT=5000
WORKDIR /app
RUN apk add --no-cache tini
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=prod-deps --chown=node:node /app/api/node_modules ./api/node_modules
COPY --chown=node:node api/package.json ./api/package.json
COPY --chown=node:node api/src ./api/src
WORKDIR /app/api
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
