const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { loadRepository } = require("../helpers/repositoryMocks");

const target = resolve(__dirname, "../../source/repositories/leaderboard.js");

test("updateLeaderboardExperience migrates legacy guild leveling", async () => {
  const { calls, repository, values } = loadRepository(target, {
    "users/user-1/guildLeveling/guild-1": { exp: 10, level: 2 },
  });
  const cache = {};

  await repository.updateLeaderboardExperience(cache, "user-1", "guild-1", 5);

  assert.deepEqual(values.get("leaderboards/guild-1/user-1"), {
    exp: 15,
    level: 2,
  });
  assert.equal(calls.at(-1)[0], "transaction");
  assert.equal(cache.leaderboardUsers.has("guild-1:user-1"), true);
});

test("setLeaderboardLevelingValue creates a complete record", async () => {
  const { repository, values } = loadRepository(target);
  const leveling = await repository.setLeaderboardLevelingValue(
    "user-1",
    "guild-1",
    "level",
    3,
  );

  assert.deepEqual(leveling, { exp: 0, level: 3 });
  assert.deepEqual(values.get("leaderboards/guild-1/user-1"), leveling);
});
