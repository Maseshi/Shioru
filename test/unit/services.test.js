const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const guildTarget = resolve(__dirname, "../../source/services/guild.js");
const levelingTarget = resolve(__dirname, "../../source/services/leveling.js");
const statisticsTarget = resolve(
  __dirname,
  "../../source/services/statistics.js",
);
const guildRepositoryPath = require.resolve("../../source/repositories/guild");
const leaderboardRepositoryPath =
  require.resolve("../../source/repositories/leaderboard");
const statisticsRepositoryPath =
  require.resolve("../../source/repositories/statistics");
const userRepositoryPath = require.resolve("../../source/repositories/user");
const notificationServicePath =
  require.resolve("../../source/services/notification");

const loadServices = () => {
  const calls = [];
  const repository = {
    ensureUser: async (userId, profile) =>
      calls.push(["ensureUser", userId, profile]),
    incrementUserExperience: async (userId, amount) => {
      calls.push(["incrementUserExperience", userId, amount]);
      return {
        leveling: { exp: amount, level: 1 },
        leveledUp: false,
        previousLevel: 1,
      };
    },
    getGuild: async (guildId) => {
      calls.push(["getGuild", guildId]);
      return null;
    },
    getLeaderboard: async (guildId, maximum) => {
      calls.push(["getLeaderboard", guildId, maximum]);
      return null;
    },
    getStatistics: async (path) => {
      calls.push(["getStatistics", path]);
      return null;
    },
    getUser: async (userId) => {
      calls.push(["getUser", userId]);
      return null;
    },
    incrementLeaderboardLevelingValue: async (...args) =>
      calls.push(["incrementLeaderboardLevelingValue", ...args]),
    incrementStatistic: async (path) =>
      calls.push(["incrementStatistic", path]),
    incrementStatistics: async (paths) =>
      calls.push(["incrementStatistics", paths]),
    incrementUserLevelingValue: async (...args) => {
      calls.push(["incrementUserLevelingValue", ...args]);
      return { exp: 0, level: 0 };
    },
    removeLeaderboardEntry: async (...args) =>
      calls.push(["removeLeaderboardEntry", ...args]),
    resetUserLeveling: async (userId) =>
      calls.push(["resetUserLeveling", userId]),
    setGuild: async (guildId, value) =>
      calls.push(["setGuild", guildId, value]),
    setUserLeveling: async (...args) =>
      calls.push(["setUserLeveling", ...args]),
    setLeaderboardLevelingValue: async (userId, guildId, type, amount) =>
      calls.push([
        "setLeaderboardLevelingValue",
        userId,
        guildId,
        type,
        amount,
      ]),
    setUserLevelingValue: async (userId, type, amount) => {
      calls.push(["setUserLevelingValue", userId, type, amount]);
      return {
        exp: type === "exp" ? amount : 0,
        level: type === "level" ? amount : 0,
      };
    },
    syncUserProfile: async (cache, userId, profile) =>
      calls.push(["syncUserProfile", cache, userId, profile]),
    updateLeaderboardExperience: async (cache, userId, guildId, amount) =>
      calls.push([
        "updateLeaderboardExperience",
        cache,
        userId,
        guildId,
        amount,
      ]),
    updateGuild: async (guildId, value) =>
      calls.push(["updateGuild", guildId, value]),
    updateStatistics: async (path, value) =>
      calls.push(["updateStatistics", path, value]),
    updateUserProfile: async (userId, profile) =>
      calls.push(["updateUserProfile", userId, profile]),
  };
  const guild = requireWithMocks(guildTarget, {
    [guildRepositoryPath]: repository,
  });
  const leveling = requireWithMocks(levelingTarget, {
    [leaderboardRepositoryPath]: repository,
    [notificationServicePath]: { submitNotification: async () => null },
    [userRepositoryPath]: repository,
  });
  const statistics = requireWithMocks(statisticsTarget, {
    [statisticsRepositoryPath]: repository,
  });
  return { calls, services: { ...guild, ...leveling, ...statistics } };
};

const client = {
  configs: {
    constants: { alternatives: ["fallback"], conversations: ["hello"] },
  },
};

test("synchronizeGuildData creates new guilds with ISO metadata", async () => {
  const { calls, services } = loadServices();
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

  const result = await services.synchronizeGuildData(client, guild, null);
  assert.equal(result.joinedAt, "2025-01-01T00:00:00.000Z");
  assert.equal(result.description, "");
  assert.deepEqual(result.language, { type: "USER", locale: "en-US" });
  assert.equal(calls[0][0], "setGuild");
  assert.equal(calls[0][1], "guild-1");
});

test("synchronizeGuildData updates changed fields without deleting custom settings", async () => {
  const { calls, services } = loadServices();
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

  const result = await services.synchronizeGuildData(client, guild, existing);
  assert.equal(result.name, "New name");
  assert.deepEqual(result.notification, existing.notification);
  assert.deepEqual(result.language, existing.language);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "updateGuild");
  assert.equal("notification" in calls[0][2], false);
});

test("statistics updates aggregate shard values and increment paths atomically", async () => {
  const { calls, services } = loadServices();
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

  await services.fetchStatistics("POST", "size", statisticsClient);
  await services.incrementStatistics(["size/worked", "commands/ping"]);

  assert.deepEqual(calls[0], [
    "updateStatistics",
    "size",
    { commands: 86, guilds: 5, users: 30 },
  ]);
  assert.deepEqual(calls[1], [
    "incrementStatistics",
    ["size/worked", "commands/ping"],
  ]);
});

test("experience updates ensure the user schema before incrementing", async () => {
  const { calls, services } = loadServices();
  const experienceClient = {
    ...client,
    temp: { cache: {} },
    logger: { error: () => undefined, warn: () => undefined },
  };
  const message = {
    guild: { id: "guild-1" },
    member: {
      id: "user-1",
      user: {
        username: "Schema user",
        displayAvatarURL: () => "https://cdn.test/user.png",
      },
    },
  };

  const result = await services.fetchLevel(experienceClient, message, "POST", {
    amount: 5,
    type: "exp",
  });

  assert.equal(result.status, "success");
  assert.deepEqual(calls[0], [
    "syncUserProfile",
    experienceClient.temp.cache,
    "user-1",
    {
      username: "Schema user",
      avatar: "https://cdn.test/user.png",
    },
  ]);
  assert.equal(calls[1][0], "incrementUserExperience");
  assert.equal(calls[2][0], "updateLeaderboardExperience");
});
