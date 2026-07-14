FROM node:22-bookworm-slim AS base

RUN apt-get update && apt-get install -y \
    libatomic1 \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY src/package*.json ./
RUN npm ci --omit=dev

FROM base AS runtime
RUN groupadd --system app && useradd --system --gid app app

COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./

RUN chown -R app:app /app

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
CMD node -e "require('http').get('http://127.0.0.1:3000/health',(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "index.js"]