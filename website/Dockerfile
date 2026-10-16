# syntax=docker/dockerfile:1.7
#
# Fiat Law — production image for Scalix Run.
#
# Build for linux/amd64 explicitly. Scalix Run compute is amd64 and this repo is
# developed on an arm64 Mac, so an unqualified `docker build` produces an image
# that runs locally and dies on the platform with "exec format error".
#
#   docker buildx build --platform linux/amd64 -t <registry>/fiat-law:<tag> --push .
#
# SITE_ENV and LEADS_DRIVER are build arguments, not runtime environment, and
# that is deliberate. robots.txt and every page's <head> are generated during
# `next build`, so whether this site invites indexing is decided at build time
# and frozen into the output. Making them runtime settings would let a preview
# image be promoted by editing a service variable, producing a site that is
# indexable while still throwing its enquiries away. A preview is its own build:
#
#   docker buildx build --platform linux/amd64 \
#     --build-arg SITE_ENV=preview --build-arg LEADS_DRIVER=sqlite \
#     -t <registry>/fiat-law:preview --push .
#
# The build happens inside the image rather than being copied from the host,
# which matters more than it looks: better-sqlite3 resolves a native binary by
# platform, and a host build traces prebuilds/darwin-arm64.node into
# .next/standalone. Copying that in would produce an image whose lead store
# throws on first write.

ARG NODE_VERSION=22.14.0

# Defaults are the production posture: indexable, leads in Nova. A preview must
# ask for the other one explicitly, so forgetting the flag produces a build that
# is wrong in the safe direction — it fails to reach its database rather than
# quietly indexing a copy of the firm's site on a scalix.run hostname.
ARG SITE_ENV=production
ARG LEADS_DRIVER=nova

# ---------------------------------------------------------------- dependencies
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app

# better-sqlite3 ships a linux-x64 prebuild, so these are a fallback rather than
# the normal path — but a failed npm ci at deploy time is worse than a slightly
# larger builder stage that is discarded anyway.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

# ---------------------------------------------------------------------- build
FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Re-declared because an ARG before the first FROM is only visible to the FROM
# lines themselves, not inside a stage.
ARG SITE_ENV
ARG LEADS_DRIVER
ENV SITE_ENV=${SITE_ENV}
ENV LEADS_DRIVER=${LEADS_DRIVER}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# The CETA datasets are committed, so the 180 MB source library is not in the
# build context and is not needed here. See scripts/extract-ceta.mjs.
RUN npm run build

# --------------------------------------------------------------------- runner
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Both must match what the build stage used. resolveDriver() would infer the
# driver from SCALIX_API_KEY, but inference is not the place to leave a decision
# whose failure mode is writing client enquiries to an ephemeral disk; and
# SITE_ENV has to agree with the robots.txt already baked into the output, or
# the site's server-rendered banner and its crawl directives disagree.
ARG SITE_ENV
ARG LEADS_DRIVER
ENV SITE_ENV=${SITE_ENV}
ENV LEADS_DRIVER=${LEADS_DRIVER}

RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 --gid nodejs nextjs

# Three artefacts, in the order Next's standalone output expects them.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# The SQLite driver opens $PWD/data/leads.db and mkdir -p's the directory, which
# it cannot do as uid 1001 in a root-owned /app. Created here so the sqlite path
# works; unused and empty when the driver is Nova.
RUN install -d -o nextjs -g nodejs /app/data

USER nextjs
EXPOSE 3000

# /robots.txt is static, needs no database and no environment, so a failing
# health check means the process is genuinely unable to serve — not that a
# downstream dependency is having a bad afternoon.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/robots.txt').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
