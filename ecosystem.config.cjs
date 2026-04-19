/**
 * PM2 configuration for Snapix SDK Preview
 */
module.exports = {
  apps: [
    {
      name: "snapix-sdk-preview",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 43008 --hostname 0.0.0.0",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
