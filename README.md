# MyApp — Dockerized Laravel + ReactJS

## Project Structure

```
.
├── backend/                        # ← Your Laravel app lives here (empty to start)
│   └── .dockerignore
│
├── frontend/                       # ← Your ReactJS app lives here (empty to start)
│   └── .dockerignore
│
├── infrastructure/                 # All Docker & infra config
│   ├── docker/
│   │   ├── backend/
│   │   │   ├── Dockerfile          # Multi-stage: development | production
│   │   │   ├── .env.example        # Laravel env template
│   │   │   └── php/
│   │   │       ├── php-dev.ini
│   │   │       ├── php-prod.ini
│   │   │       └── xdebug.ini
│   │   └── frontend/
│   │       ├── Dockerfile          # Multi-stage: development | production
│   │       ├── .env.example        # Vite/React env template
│   │       └── nginx.conf          # SPA fallback routing (prod)
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── .env.example                # MySQL production secrets
│   ├── nginx/
│   │   └── conf.d/
│   │       └── backend.conf        # Nginx → PHP-FPM proxy config
│   └── mysql/
│       └── init.sql                # Creates app DB + test DB on first run
│
├── Makefile                        # Single-command operations
└── .gitignore
```

## Quick Start (Development)

```bash
# 1. Clone the repo
git clone <your-repo> && cd <your-repo>

# 2. Drop your Laravel app into backend/ and React app into frontend/

# 3. First-time setup — copies .env files, builds images, runs migrations
make setup

# Done!
#   Backend  → http://localhost:8000
#   Frontend → http://localhost:3000
```

## Common Commands

| Command | Description |
|---|---|
| `make setup` | **First-time** setup (build, start, migrate) |
| `make up` | Start all services (dev) |
| `make up ENV=prod` | Start all services (prod) |
| `make down` | Stop all services |
| `make restart` | Restart all services |
| `make build` | Rebuild Docker images |
| `make logs` | Tail logs from all containers |
| `make ps` | List running containers |
| `make shell-backend` | Shell into the Laravel container |
| `make shell-frontend` | Shell into the React container |
| `make migrate` | Run Laravel migrations |
| `make migrate-fresh` | Fresh migration + seeders |
| `make fresh` | Full wipe + rebuild (nuclear reset) |

## Environment Files

`make setup` auto-copies these from their `.example` templates:

| File (auto-created) | Copied from | Purpose |
|---|---|---|
| `backend/.env` | `infrastructure/docker/backend/.env.example` | Laravel config |
| `frontend/.env` | `infrastructure/docker/frontend/.env.example` | Vite/React config |
| `infrastructure/.env` | `infrastructure/.env.example` | MySQL prod secrets |

## Production Deployment

```bash
# Fill in real credentials in each .env, then:
make up ENV=prod
```

> **SSL**: Place your certs in `infrastructure/nginx/ssl/` and update `backend.conf` for HTTPS.

## Services & Ports

| Service | Dev Port | Prod Port | Description |
|---|---|---|---|
| `nginx` | 8000 | 80 / 443 | Serves Laravel via PHP-FPM |
| `frontend` | 3000 | 3000 | React (Vite dev / Nginx prod) |
| `mysql` | 3306 | internal | MySQL 8.0 |
| `backend` | internal | internal | PHP-FPM |
