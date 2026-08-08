const assert = require("node:assert/strict");
const test = require("node:test");
const { createHealthServer } = require("../../source/utils/servicesUtils");

const startServer = async (t, options) => {
  const server = createHealthServer(
    [{ name: "Database", status: "ok" }],
    options,
  );
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
};

test("health server serves root, health JSON, and not-found responses", async (t) => {
  const baseURL = await startServer(t);

  const root = await fetch(`${baseURL}/`);
  assert.equal(root.status, 200);
  assert.equal(await root.text(), "Services is running.");

  const health = await fetch(`${baseURL}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), [{ name: "Database", status: "ok" }]);

  const missing = await fetch(`${baseURL}/missing`);
  assert.equal(missing.status, 404);
});

test("health server rate limits the first forwarded IP only within its window", async (t) => {
  let now = 1000;
  const baseURL = await startServer(t, {
    maxRequests: 2,
    rateLimit: 100,
    now: () => now,
  });
  const headers = { "x-forwarded-for": "203.0.113.10, 127.0.0.1" };

  assert.equal((await fetch(`${baseURL}/health`, { headers })).status, 200);
  assert.equal((await fetch(`${baseURL}/health`, { headers })).status, 200);
  assert.equal((await fetch(`${baseURL}/health`, { headers })).status, 429);

  now += 101;
  assert.equal((await fetch(`${baseURL}/health`, { headers })).status, 200);
});
