FROM node:22-bookworm-slim AS base

RUN apt-get update && apt-get install -y \
    libatomic1 \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps

COPY notification-service/package*.json ./

# Install all dependencies (including Prisma CLI)
RUN npm ci

# Copy Prisma schema
COPY notification-service/prisma ./prisma

# Generate Prisma Client (Prisma 6)
RUN npx prisma generate

# Remove dev dependencies
RUN npm prune --omit=dev

FROM base AS runtime

RUN groupadd --system app && useradd --system --gid app app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY notification-service/ ./

RUN chown -R app:app /app

USER app

EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
CMD node -e "require('http').get('http://127.0.0.1:4001/health',(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "src/index.js"]