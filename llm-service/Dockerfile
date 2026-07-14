FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY llm-service/package*.json ./
RUN npm ci --omit=dev

FROM base AS runtime
RUN groupadd --system app && useradd --system --gid app app
COPY --from=deps /app/node_modules ./node_modules
COPY llm-service/ ./
RUN chown -R app:app /app
USER app
EXPOSE 4002
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:4002/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
CMD ["node", "src/index.js"]
