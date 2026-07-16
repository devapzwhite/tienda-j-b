FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Also need build dependencies for bcrypt and other native modules
RUN apk add --no-cache python3 make g++ 

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter database exec prisma generate

# Build the API project
RUN pnpm --filter api build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache python3 make g++ libc6-compat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/scripts ./apps/api/scripts

# Expose the API port
EXPOSE 3001

# Run from apps/api so relative paths match
WORKDIR /app/apps/api

# Command to run the API
CMD ["sh", "scripts/start.sh"]
