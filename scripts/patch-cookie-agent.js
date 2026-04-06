/**
 * Patch http-cookie-agent to work with Bun runtime.
 * Bun does not implement undici.Agent.compose() method,
 * so we add a fallback check before calling it.
 */
const { readFileSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const filePath = resolve(
  __dirname,
  "..",
  "node_modules",
  "http-cookie-agent",
  "dist",
  "undici",
  "cookie_agent.js",
);

try {
  let content = readFileSync(filePath, "utf-8");

  if (content.includes("typeof this.compose")) {
    console.log("[patch] http-cookie-agent already patched, skipping.");
    process.exit(0);
  }

  content = content.replace(
    "if (cookieOpts != null) {",
    "if (cookieOpts != null && typeof this.compose === 'function') {",
  );

  writeFileSync(filePath, content, "utf-8");
  console.log("[patch] http-cookie-agent patched for Bun compatibility.");
} catch (err) {
  console.warn("[patch] Could not patch http-cookie-agent:", err.message);
}
