const assert = require("node:assert/strict");
const test = require("node:test");
const {
  createHealthServer,
  submitTopGGStatistics,
} = require("../../source/utils/servicesUtils");

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

test("Top.gg statistics wait for every shard and aggregate guild counts", async () => {
  const requests = [];
  const logs = [];
  const client = {
    shards: new Map([
      [0, { ready: true }],
      [1, { ready: false }],
    ]),
    fetchClientValues: async () => [2, 3],
  };
  const options = {
    fetchImpl: async (url, request) => {
      requests.push({ request, url });
      return { ok: true };
    },
    statisticsLogger: {
      error: (...args) => logs.push(["error", ...args]),
      info: (...args) => logs.push(["info", ...args]),
      warn: (...args) => logs.push(["warn", ...args]),
    },
    topGGToken: "top-gg-token",
  };

  assert.equal(await submitTopGGStatistics(client, options), false);
  assert.equal(requests.length, 0);

  client.shards.get(1).ready = true;
  assert.equal(await submitTopGGStatistics(client, options), true);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://top.gg/api/bots/stats");
  assert.deepEqual(JSON.parse(requests[0].request.body), {
    server_count: 5,
    shard_count: 2,
  });
  assert.equal(logs.at(-1)[0], "info");
});

test("Top.gg statistics contain request failures without rejecting", async () => {
  const errors = [];
  const result = await submitTopGGStatistics(
    {
      shards: new Map([[0, { ready: true }]]),
      fetchClientValues: async () => {
        throw new Error("IPC unavailable");
      },
    },
    {
      statisticsLogger: {
        error: (error) => errors.push(error.message),
        info: () => undefined,
        warn: () => undefined,
      },
      topGGToken: "top-gg-token",
    },
  );

  assert.equal(result, false);
  assert.deepEqual(errors, ["IPC unavailable"]);
});
