# ─────────────────────────────────────────────────────────────────────────────
# Multi-stage Dockerfile for the ecommerce monorepo
#
# Stages
#   base      — Node + pnpm, shared layer
#   deps      — install all workspace dependencies
#   builder   — build all packages and apps
#   runner    — lean production image (no devDeps, no build tools)
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: base ─────────────────────────────────────────────────────────────
FROM node:24-alpine AS base

# Install pnpm via corepack (matches packageManager field in package.json)
RUN corepack enable && corepack prepare pnpm@11.0.4 --activate

WORKDIR /app

# ── Stage 2: deps ─────────────────────────────────────────────────────────────
FROM base AS deps

# Copy manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy all package.json files (needed for workspace resolution)
COPY apps/storefront/package.json    apps/storefront/package.json
COPY apps/seller/package.json        apps/seller/package.json
COPY apps/admin/package.json         apps/admin/package.json
COPY apps/api-storefront/package.json apps/api-storefront/package.json
COPY apps/api-seller/package.json    apps/api-seller/package.json
COPY apps/api-admin/package.json     apps/api-admin/package.json

COPY packages/auth/package.json          packages/auth/package.json
COPY packages/auth-next/package.json     packages/auth-next/package.json
COPY packages/config/package.json        packages/config/package.json
COPY packages/contracts/package.json     packages/contracts/package.json
COPY packages/core-ui/package.json       packages/core-ui/package.json
COPY packages/database/package.json      packages/database/package.json
COPY packages/email/package.json         packages/email/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/nestjs-core/package.json   packages/nestjs-core/package.json
COPY packages/nestjs-openapi/package.json packages/nestjs-openapi/package.json
COPY packages/redis/package.json         packages/redis/package.json
COPY packages/shared/package.json        packages/shared/package.json
COPY packages/ui-admin/package.json      packages/ui-admin/package.json
COPY packages/ui-seller/package.json     packages/ui-seller/package.json
COPY packages/ui-storefront/package.json packages/ui-storefront/package.json
COPY packages/api-client/package.json    packages/api-client/package.json

RUN pnpm install --frozen-lockfile --ignore-scripts

# ── Stage 3: builder ──────────────────────────────────────────────────────────
FROM base AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages

# Copy full source
COPY . .

# Re-run install to link workspace packages (scripts now allowed for prisma etc.)
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm db:generate

# Build all packages and apps via Turborepo
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ── Stage 4: runner ───────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

RUN corepack enable && corepack prepare pnpm@11.0.4 --activate

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what's needed to run
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/.npmrc ./.npmrc

# Packages (dist + node_modules)
COPY --from=builder /app/packages ./packages

# Apps (built output + node_modules)
COPY --from=builder /app/apps/storefront/.next    ./apps/storefront/.next
COPY --from=builder /app/apps/storefront/package.json ./apps/storefront/package.json
COPY --from=builder /app/apps/storefront/public   ./apps/storefront/public

COPY --from=builder /app/apps/seller/.next        ./apps/seller/.next
COPY --from=builder /app/apps/seller/package.json ./apps/seller/package.json
COPY --from=builder /app/apps/seller/public       ./apps/seller/public

COPY --from=builder /app/apps/admin/.next         ./apps/admin/.next
COPY --from=builder /app/apps/admin/package.json  ./apps/admin/package.json
COPY --from=builder /app/apps/admin/public        ./apps/admin/public

COPY --from=builder /app/apps/api-storefront/dist ./apps/api-storefront/dist
COPY --from=builder /app/apps/api-storefront/package.json ./apps/api-storefront/package.json

COPY --from=builder /app/apps/api-seller/dist     ./apps/api-seller/dist
COPY --from=builder /app/apps/api-seller/package.json ./apps/api-seller/package.json

COPY --from=builder /app/apps/api-admin/dist      ./apps/api-admin/dist
COPY --from=builder /app/apps/api-admin/package.json ./apps/api-admin/package.json

# Install production deps only
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser
USER appuser

# Default command — overridden per-service in docker-compose.yml
CMD ["node", "--version"]
