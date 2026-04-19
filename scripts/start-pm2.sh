#!/bin/bash

# Define the application directory
# Assumes this script is located in your_project_root/scripts/
APP_DIR="$(dirname "$0")/.."

cd "$APP_DIR" || {
  echo "Error: Failed to change directory to $APP_DIR"
  exit 1
}

echo "Current directory: $(pwd)"

echo "Ensuring dependencies are installed with pnpm..."
pnpm install --frozen-lockfile || {
  echo "Error: pnpm install failed"
  exit 1
}

echo "Running Next.js build process..."
pnpm run build || {
  echo "Error: Next.js build failed"
  exit 1
}

PM2_APP_NAME="snapix-sdk-preview"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Error: PM2 not found. Please install PM2 globally (e.g., npm install -g pm2)."
  exit 1
fi

echo "Stopping and deleting existing PM2 process ($PM2_APP_NAME) if running..."
if pm2 list | grep -q " ${PM2_APP_NAME} "; then
  echo "$PM2_APP_NAME found in PM2 list. Stopping and deleting..."
  pm2 stop "$PM2_APP_NAME"
  pm2 delete "$PM2_APP_NAME"
  echo "$PM2_APP_NAME stopped and deleted."
else
  echo "$PM2_APP_NAME not found in PM2 list. No need to stop/delete."
fi

mkdir -p ./logs || {
  echo "Error: Failed to create logs directory"
  exit 1
}

echo "Starting application with PM2 using ecosystem.config.cjs..."
pm2 start ecosystem.config.cjs || {
  echo "Error: PM2 failed to start the application"
  exit 1
}

echo "PM2 status:"
pm2 status

echo "PM2 configuration save."
pm2 save

echo "Deployment script finished."
exit 0
