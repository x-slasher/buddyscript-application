# ============================================================
#  MyApp — Docker management commands
#  Run all commands from the REPO ROOT
#  Usage: make <command> [ENV=dev|prod]
# ============================================================

ENV     ?= dev
COMPOSE  = docker compose -f infrastructure/docker-compose.$(ENV).yml
BACKEND  = $(COMPOSE) exec backend
ARTISAN  = $(BACKEND) php artisan

.PHONY: help up down restart build logs ps shell-backend shell-frontend \
        migrate migrate-fresh seed fresh setup

# ── Default ─────────────────────────────────────────────────
help:
	@echo ""
	@echo "  MyApp Docker Commands"
	@echo "  ─────────────────────────────────────────────"
	@echo "  make setup             First-time setup (dev)"
	@echo "  make up                Start all services (dev)"
	@echo "  make up ENV=prod       Start all services (prod)"
	@echo "  make down              Stop all services"
	@echo "  make restart           Restart all services"
	@echo "  make build             Build / rebuild images"
	@echo "  make logs              Tail logs (all services)"
	@echo "  make ps                List running containers"
	@echo ""
	@echo "  make shell-backend     Shell into backend container"
	@echo "  make shell-frontend    Shell into frontend container"
	@echo ""
	@echo "  make migrate           Run Laravel migrations"
	@echo "  make migrate-fresh     Fresh migration + seed"
	@echo "  make seed              Run database seeders"
	@echo "  make fresh             Rebuild images + fresh migrate"
	@echo ""

# ── Lifecycle ────────────────────────────────────────────────

## First-time dev setup
setup:
	@echo "→ Copying env files if they don't exist..."
	@[ -f backend/.env ]        || cp infrastructure/docker/backend/.env.example backend/.env
	@[ -f frontend/.env ]       || cp infrastructure/docker/frontend/.env.example frontend/.env
	@[ -f infrastructure/.env ] || cp infrastructure/.env.example infrastructure/.env
	@echo "→ Building images..."
	$(COMPOSE) build --no-cache
	@echo "→ Starting services..."
	$(COMPOSE) up -d
	@echo "→ Waiting for MySQL to be ready..."
	@sleep 8
	@echo "→ Generating Laravel app key..."
	$(ARTISAN) key:generate
	@echo "→ Running migrations..."
	$(ARTISAN) migrate --force
	@echo "→ Seeding database..."
	$(ARTISAN) db:seed --force
	@echo ""
	@echo "  ✓ Setup complete!"
	@echo "  Backend  → http://localhost:8000"
	@echo "  Frontend → http://localhost:3000"
	@echo ""

## Start services
up:
	$(COMPOSE) up -d
	@echo ""
	@echo "  Services started ($(ENV))"
	@echo "  Backend  → http://localhost:8000"
	@echo "  Frontend → http://localhost:3000"
	@echo ""

## Stop services
down:
	$(COMPOSE) down

## Restart all services
restart:
	$(COMPOSE) down
	$(COMPOSE) up -d

## Build / rebuild images
build:
	$(COMPOSE) build

## Tail logs from all containers
logs:
	$(COMPOSE) logs -f

## List running containers
ps:
	$(COMPOSE) ps

# ── Shells ───────────────────────────────────────────────────

shell-backend:
	$(BACKEND) sh

shell-frontend:
	$(COMPOSE) exec frontend sh

# ── Laravel / Database ───────────────────────────────────────

migrate:
	$(ARTISAN) migrate

migrate-fresh:
	$(ARTISAN) migrate:fresh --seed

seed:
	$(ARTISAN) db:seed

## Full wipe: stop → remove volumes → rebuild → fresh migrate
fresh:
	$(COMPOSE) down -v
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d
	@sleep 8
	$(ARTISAN) key:generate
	$(ARTISAN) migrate:fresh --seed