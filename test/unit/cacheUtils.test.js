const assert = require("node:assert/strict");
const test = require("node:test");
const {
  getMetricsReport,
  initializeMetrics,
} = require("../../source/utils/metricsUtils");
const {
  getGuildData,
  getGuildDjs,
  unwatchGuildData,
} = require("../../source/utils/cacheUtils");

const createClient = () => ({
  configs: {
    djs: {
      enabled: false,
      roles: ["default-role"],
      users: ["default-user"],
    },
    metrics: { enabled: true, label: "cache-unit-test" },
  },
  guildSettings: new Map(),
  logger: { info: () => undefined },
  temp: { listeners: new Map() },
});

test("getGuildData reports cache hits and misses", () => {
  const client = createClient();
  initializeMetrics(client);
  client.guildSettings.set("known", { language: "th" });

  assert.deepEqual(getGuildData(client, "known"), { language: "th" });
  assert.equal(getGuildData(client, "missing"), null);
  assert.equal(getGuildData(client), null);

  assert.deepEqual(getMetricsReport().total.cache, {
    hits: 1,
    misses: 1,
    hitRate: 0.5,
  });
});

test("getGuildDjs merges guild configuration without sharing arrays", () => {
  const client = createClient();
  initializeMetrics(client);
  const guildDjs = {
    enabled: true,
    roles: ["guild-role"],
    users: ["guild-user"],
  };
  client.guildSettings.set("guild", { djs: guildDjs });

  const result = getGuildDjs(client, "guild");
  assert.deepEqual(result, guildDjs);

  result.roles.push("another-role");
  result.users.push("another-user");
  assert.deepEqual(guildDjs.roles, ["guild-role"]);
  assert.deepEqual(guildDjs.users, ["guild-user"]);
});

test("unwatchGuildData unsubscribes and clears guild state", () => {
  const client = createClient();
  let unsubscribeCalls = 0;
  client.guildSettings.set("guild", { language: "th" });
  client.temp.listeners.set("guild:guild", () => {
    unsubscribeCalls += 1;
  });

  unwatchGuildData(client, "guild");

  assert.equal(unsubscribeCalls, 1);
  assert.equal(client.guildSettings.has("guild"), false);
  assert.equal(client.temp.listeners.has("guild:guild"), false);
});

test("getGuildDjs falls back to defaults and initializes missing cache maps", () => {
  const client = {
    configs: {
      djs: { enabled: false, roles: ["role"], users: ["user"] },
      metrics: { enabled: false, label: "cache-test" },
    },
    logger: { info: () => undefined },
    temp: {},
  };
  initializeMetrics(client);

  assert.deepEqual(getGuildDjs(client, "missing"), client.configs.djs);
  assert.ok(client.guildSettings instanceof Map);
  assert.ok(client.temp.listeners instanceof Map);
});
