# BuddyScript — Dockerized Laravel + ReactJS

## Requirements

Before running the application, make sure you have **Docker Desktop** installed and running.

### Install Docker Desktop

**Windows**
1. Download from https://www.docker.com/products/docker-desktop
2. Run the installer and follow the steps
3. After install, open Docker Desktop and wait until it says **"Engine running"**
4. Make sure **"Use WSL 2 based engine"** is enabled in Settings → General

**Mac**
1. Download from https://www.docker.com/products/docker-desktop
2. Open the `.dmg` file and drag Docker to Applications
3. Launch Docker from Applications and wait until it says **"Engine running"**

**Linux (Ubuntu/Debian)**
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

---

## Quick Start

### Windows (Git Bash)
```bash
git clone <your-repo-url>
cd buddyscript-application
bash run.sh
```

### Mac / Linux
```bash
git clone <your-repo-url>
cd buddyscript-application
bash run.sh
```

The `run.sh` script will:
- Install `make` automatically if not found
- Copy all `.env` files from the provided examples
- Build all Docker images
- Start all containers
- Generate the Laravel app key
- Run database migrations
- Seed the database

Once complete:
- **Backend (Laravel)** → http://localhost:8000
- **Frontend (React)** → http://localhost:3000

---

## Project Structure

```
.
├── backend/                        # Laravel application
│   └── .dockerignore
│
├── frontend/                       # ReactJS application
│   └── .dockerignore
│
├── infrastructure/                 # All Docker & infra config
│   ├── docker/
│   │   ├── backend/
│   │   │   ├── Dockerfile          # Multi-stage: development | production
│   │   │   ├── .env.example        # Laravel env (auto-copied on setup)
│   │   │   └── php/
│   │   │       ├── php-dev.ini
│   │   │       ├── php-prod.ini
│   │   │       └── xdebug.ini
│   │   └── frontend/
│   │       ├── Dockerfile          # Multi-stage: development | production
│   │       ├── .env.example        # React env (auto-copied on setup)
│   │       └── nginx.conf          # SPA fallback routing (prod)
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   ├── .env.example                # MySQL secrets (auto-copied on setup)
│   ├── nginx/
│   │   └── conf.d/
│   │       └── backend.conf        # Nginx → PHP-FPM proxy config
│   └── mysql/
│       └── init.sql                # Creates app DB + test DB on first run
│
├── Makefile                        # All dev commands
├── run.sh                          # Auto-install make + run setup
├── run.bat                         # Windows CMD alternative
└── .gitignore
```

---

## All Commands

| Command | Description |
|---|---|
| `make setup` | **First-time** setup (build, start, migrate, seed) |
| `make up` | Start all services (dev) |
| `make up ENV=prod` | Start all services (prod) |
| `make down` | Stop all services |
| `make restart` | Restart all services |
| `make build` | Rebuild Docker images |
| `make logs` | Tail logs from all containers |
| `make ps` | List running containers |
| `make shell-backend` | Shell into the Laravel container |
| `make shell-frontend` | Shell into the React container |
| `make migrate` | Run migrations |
| `make migrate-fresh` | Fresh migration + seed |
| `make fresh` | Full wipe + rebuild + fresh migrate |

---

## Services & Ports

| Service | Port | Description |
|---|---|---|
| Laravel (Nginx) | 8000 | Backend API |
| React (Vite) | 3000 | Frontend app |
| MySQL | 3306 | Database |

---

## Troubleshooting

**Docker Desktop not running**
Make sure Docker Desktop is open and the engine is running before running any command.

**Port already in use**
If ports 8000, 3000, or 3306 are in use by another app, stop that app or change the ports in `infrastructure/docker-compose.dev.yml`.

**make: command not found (Windows)**
Run using `bash run.sh` from Git Bash — it will install `make` automatically. Or from Command Prompt run `run.bat`.

**Fresh reset**
If something is broken and you want to start from scratch:
```bash
make fresh
```
This wipes all volumes, rebuilds images, and re-runs migrations and seeders.
