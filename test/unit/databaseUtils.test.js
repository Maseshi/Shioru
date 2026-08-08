const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const target = resolve(__dirname, "../../source/utils/databaseUtils.js");
const firebasePath = require.resolve("firebase/database");
const metricsPath = require.resolve("../../source/utils/metricsUtils");
const cachePath = require.resolve("../../source/utils/cacheUtils");
const clientUtilsPath = require.resolve("../../source/utils/clientUtils");

const loadDatabaseUtils = () => {
  const calls = [];
  const reference = (path) => ({
    path,
    toString: () => `https://db.test/${path}`,
  });
  const firebase = {
    child: (parent, name) => reference(`${parent.path}/${name}`),
    getDatabase: () => ({ name: "database" }),
    increment: (amount) => ({ ".sv": { increment: amount } }),
    limitToLast: (maximum) => ({ type: "limit", maximum }),
    orderByChild: (key) => ({ type: "order", key }),
    query: (targetRef, ...constraints) => ({ targetRef, constraints }),
    ref: (_database, path) => reference(path),
  };
  const metrics = {
    trackedGet: async (targetRef) => {
      calls.push(["get", targetRef]);
      return { exists: () => false, val: () => null };
    },
    trackedRemove: async (targetRef) => calls.push(["remove", targetRef]),
    trackedRunTransaction: async (targetRef, update) => {
      calls.push(["transaction", targetRef]);
      const value = update(null);
      return { committed: true, snapshot: { val: () => value } };
    },
    trackedSet: async (targetRef, value) =>
      calls.push(["set", targetRef, value]),
    trackedUpdate: async (targetRef, value) =>
      calls.push(["update", targetRef, value]),
  };
  const databaseUtils = requireWithMocks(target, {
    [firebasePath]: firebase,
    [metricsPath]: metrics,
    [cachePath]: { getGuildData: () => null },
    [clientUtilsPath]: { embedBuilder: () => ({}) },
  });
  return { calls, databaseUtils, metrics };
};

const client = {
  configs: {
    constants: { alternatives: ["fallback"], conversations: ["hello"] },
  },
};

test("dataStructures returns complete fresh defaults", () => {
  const { databaseUtils } = loadDatabaseUtils();
  const firstUser = databaseUtils.dataStructures(client, "user");
  const secondUser = databaseUtils.dataStructures(client, "user");
  firstUser.guilds.push("guild");

  assert.deepEqual(secondUser, {
    leveling: { exp: 0, level: 0 },
    guildLeveling: {},
    guilds: [],
  });
  assert.deepEqual(databaseUtils.dataStructures(client, "language"), {
    type: "USER",
    locale: "en-US",
  });
  assert.equal(databaseUtils.dataStructures(client, "missing"), undefined);
});

test("synchronizeGuildData creates new guilds with ISO metadata", async () => {
  const { calls, databaseUtils } = loadDatabaseUtils();
  const guild = {
    id: "guild-1",
    joinedAt: new Date("2025-01-01T00:00:00.000Z"),
    createdAt: new Date("2020-01-01T00:00:00.000Z"),
    description: null,
    iconURL: () => "https://cdn.test/icon.png",
    preferredLocale: "th",
    memberCount: 42,
    name: "Test guild",
    verified: false,
  };

  const result = await databaseUtils.synchronizeGuildData(client, guild, null);
  assert.equal(result.joinedAt, "2025-01-01T00:00:00.000Z");
  assert.equal(result.description, "");
  assert.deepEqual(result.language, { type: "USER", locale: "en-US" });
  assert.equal(calls[0][0], "set");
  assert.equal(calls[0][1].path, "guilds/guild-1");
});

test("synchronizeGuildData updates changed fields without deleting custom settings", async () => {
  const { calls, databaseUtils } = loadDatabaseUtils();
  const existing = {
    name: "Old name",
    language: { type: "CUSTOM", locale: "th" },
    notification: { general: { enable: true } },
  };
  const guild = {
    id: "guild-2",
    joinedAt: null,
    createdAt: null,
    description: null,
    iconURL: () => null,
    preferredLocale: "en-US",
    memberCount: 5,
    name: "New name",
    verified: false,
  };

  const result = await databaseUtils.synchronizeGuildData(
    client,
    guild,
    existing,
  );
  assert.equal(result.name, "New name");
  assert.deepEqual(result.notification, existing.notification);
  assert.deepEqual(result.language, existing.language);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "update");
  assert.equal("notification" in calls[0][2], false);
});

test("statistics updates aggregate shard values and increment paths atomically", async () => {
  const { calls, databaseUtils } = loadDatabaseUtils();
  const statisticsClient = {
    commands: { size: 86 },
    guilds: { cache: { size: 1 } },
    users: { cache: { size: 2 } },
    shard: {
      count: 2,
      fetchClientValues: async (path) =>
        path.startsWith("guilds") ? [2, 3] : [10, 20],
    },
  };

  await databaseUtils.fetchStatistics("POST", "size", statisticsClient);
  await databaseUtils.incrementStatistics(["size/worked", "commands/ping"]);

  assert.deepEqual(calls[0][2], { commands: 86, guilds: 5, users: 30 });
  assert.deepEqual(calls[1][2], {
    "size/worked": { ".sv": { increment: 1 } },
    "commands/ping": { ".sv": { increment: 1 } },
  });
});
