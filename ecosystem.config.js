const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

// Load .env file into object
const loadEnv = () => {
  try {
    const content = readFileSync(resolve(__dirname, ".env"), "utf-8");
    const env = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
};

module.exports = {
  apps: [
    {
      name: "shioru",
      script: "./source/shard.js",
      interpreter: "bun",
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        npm_lifecycle_event: "start",
        ...loadEnv(),
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.SSH_USERNAME,
      host: process.env.SSH_HOST,
      ref: "origin/main",
      repo: "Maseshi/Shioru",
      path: "~/app",
      "pre-deploy-local": "",
      "post-deploy":
        "bun install --frozen-lockfile && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
