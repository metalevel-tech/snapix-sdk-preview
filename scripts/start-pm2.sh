#!/bin/bash

# Define the application directory
# Assumes this script is located in your_project_root/scripts/
# Adjust the path accordingly if the script is elsewhere
APP_DIR="$(dirname "$0")/.." # Go up one level from the 'scripts' directory

# Change to the application directory
cd "$APP_DIR" || {
  echo "Error: Failed to change directory to $APP_DIR"
  exit 1
}

echo "Current directory: $(pwd)"

# Ensure dependencies are installed using pnpm
echo "Ensuring dependencies are installed with pnpm..."
# Using --prod only installs production dependencies, keeping node_modules smaller
# --frozen-lockfile ensures you install exactly what's in pnpm-lock.yaml
pnpm install --frozen-lockfile || {
  echo "Error: pnpm install failed"
  exit 1
}

# Run the build process
# This will also trigger the 'prebuild' script (db:migrate) defined in package.json
echo "Running Next.js build process..."
pnpm run build || {
  echo "Error: Next.js build failed"
  exit 1
}

# Define the PM2 application name from your ecosystem.config.js
PM2_APP_NAME="snapix-sdk-preview" # Make sure this matches the 'name' in ecosystem.config.js

# Check if PM2 is available
if ! command -v pm2 >/dev/null 2>&1; then
  echo "Error: PM2 not found. Please install PM2 globally (e.g., npm install -g pm2)."
  exit 1
fi

# Stop and delete the existing PM2 process if it's running
echo "Stopping and deleting existing PM2 process ($PM2_APP_NAME) if running..."
# Check if the process exists before trying to stop/delete
if pm2 list | grep -q " ${PM2_APP_NAME} "; then
  echo "$PM2_APP_NAME found in PM2 list. Stopping and deleting..."
  pm2 stop "$PM2_APP_NAME"
  pm2 delete "$PM2_APP_NAME"
  echo "$PM2_APP_NAME stopped and deleted."
else
  echo "$PM2_APP_NAME not found in PM2 list. No need to stop/delete."
fi

# Create logs directory if it doesn't exist
mkdir -p ./logs || {
  echo "Error: Failed to create logs directory"
  exit 1
}

# Start the application with PM2 using the ecosystem file
echo "Starting application with PM2 using ecosystem.config.js..."
# The --env flag can be used if you defined env_production block in ecosystem.config.js
# but using the 'env' block directly is also common. Let's rely on the 'env' block.
pm2 start ecosystem.config.cjs || {
  echo "Error: PM2 failed to start the application"
  exit 1
}

# Display PM2 status
echo "PM2 status:"
pm2 status

# Save the PM2 configuration
echo "PM2 configuration save."
pm2 save

echo "Deployment script finished."
exit 0 # Indicate success
