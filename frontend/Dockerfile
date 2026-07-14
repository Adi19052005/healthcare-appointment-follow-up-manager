FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

ARG VITE_API_URL=/api
ARG VITE_NOTIFICATION_SERVICE_URL=/api/notifications

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_NOTIFICATION_SERVICE_URL=$VITE_NOTIFICATION_SERVICE_URL

RUN npm run build


FROM nginx:1.27-alpine

COPY frontend/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx","-g","daemon off;"]
