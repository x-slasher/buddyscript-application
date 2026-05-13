FROM node:20-alpine AS base
WORKDIR /app

# ─────────────────────────────────────────────
# Dependencies stage
# ─────────────────────────────────────────────
FROM base AS deps

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# ─────────────────────────────────────────────
# Development stage
# ─────────────────────────────────────────────
FROM deps AS development

COPY frontend/ .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─────────────────────────────────────────────
# Builder stage
# ─────────────────────────────────────────────
FROM deps AS builder

COPY frontend/ .
RUN npm run build

# ─────────────────────────────────────────────
# Production stage (serve via Nginx)
# ─────────────────────────────────────────────
FROM nginx:alpine AS production

COPY infrastructure/docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
