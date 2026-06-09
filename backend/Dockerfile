# ---- Stage 1: Install deps with bun ----
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Stage 2: Build ----
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---- Stage 3: Production ----
FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Runtime deps only
COPY --from=deps /app/node_modules ./node_modules
# Compiled output
COPY --from=builder /app/dist ./dist
# Drizzle migrations + config
COPY --from=builder /app/drizzle ./drizzle
COPY drizzle.config.ts ./
COPY package.json ./

EXPOSE 3000

# Run migrations then start
CMD ["sh", "-c", "bunx drizzle-kit migrate && node dist/main.js"]
