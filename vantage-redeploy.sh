#!/usr/bin/env bash
set -e

BACKEND_CONTAINER="vantage-api-backend"
FRONTEND_CONTAINER="vantage-client-frontend"
DEFAULT_BRANCH="main"

# Utility function to ask yes/no
ask() {
    local prompt="$1"
    local default="$2"
    local response

    while true; do
        read -rp "$prompt [y/n] " response
        case "$response" in
            [Yy]*) return 0 ;;
            [Nn]*) return 1 ;;
            "") [[ "$default" == "y" ]] && return 0 || return 1 ;;
            *) echo "Please answer y or n." ;;
        esac
    done
}

echo "🚀 Vantage Auto-Deploy Script"

# Step 1: Pull latest code from main
if ask "Do you want to pull the latest code from '$DEFAULT_BRANCH' branch?" "y"; then
    git fetch origin
    git checkout $DEFAULT_BRANCH
    git pull origin $DEFAULT_BRANCH
else
    echo "⚠️ Skipping git pull."
fi

# Step 2: Stop & remove old containers
echo "🛑 Stopping and removing old containers..."
docker stop $BACKEND_CONTAINER 2>/dev/null || true
docker rm $BACKEND_CONTAINER 2>/dev/null || true
docker stop $FRONTEND_CONTAINER 2>/dev/null || true
docker rm $FRONTEND_CONTAINER 2>/dev/null || true

# Step 3: Optional prune old images
if ask "Do you want to prune unused Docker images?" "n"; then
    docker image prune -af
fi

# Step 4: Build Docker images (with or without cache)
if ask "Do you want to build Docker images WITHOUT cache?" "n"; then
    docker compose build --no-cache
else
    docker compose build
fi

# Step 5: Deploy stack
echo "🚀 Starting Docker containers..."
docker compose up -d --build

echo "✅ Deployment complete!"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
