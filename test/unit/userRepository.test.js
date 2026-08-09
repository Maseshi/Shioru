const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { loadRepository } = require("../helpers/repositoryMocks");

const target = resolve(__dirname, "../../source/repositories/user.js");

test("ensureUser initializes defaults without deleting existing fields", async () => {
  const { repository, values } = loadRepository(target, {
    "users/user-1": {
      leveling: { exp: 10, level: 2 },
      custom: { retained: true },
    },
  });

  await repository.ensureUser("user-1", { username: "Schema user" });
  const user = values.get("users/user-1");

  assert.equal(user.username, "Schema user");
  assert.equal(user.leveling.exp, 10);
  assert.deepEqual(user.custom, { retained: true });
  assert.deepEqual(user.guilds, []);
});

test("incrementUserExperience validates and applies a level up", async () => {
  const { repository } = loadRepository(target, {
    "users/user-1/leveling": { exp: 199, level: 1 },
  });

  const result = await repository.incrementUserExperience("user-1", 2);

  assert.deepEqual(result.leveling, { exp: 1, level: 2 });
  assert.equal(result.leveledUp, true);
  assert.equal(result.previousLevel, 1);
});

test("setUserLevelingValue upserts a complete leveling record", async () => {
  const { repository } = loadRepository(target, {
    "users/user-1/leveling": { exp: 10, level: 2 },
  });

  const leveling = await repository.setUserLevelingValue("user-1", "exp", 25);
  assert.deepEqual(leveling, { exp: 25, level: 2 });
});

test("ephemeral setting defaults to true and can be disabled", async () => {
  const { repository, values } = loadRepository(target, {
    "users/user-1": { leveling: { exp: 10, level: 2 } },
  });

  assert.equal(await repository.getUserEphemeral("user-1"), true);
  assert.equal(await repository.setUserEphemeral("user-1", false), false);
  assert.deepEqual(values.get("users/user-1").settings, { ephemeral: false });
  assert.deepEqual(values.get("users/user-1").leveling, { exp: 10, level: 2 });
});

test("ephemeral setting respects an explicitly disabled value", async () => {
  const { repository } = loadRepository(target, {
    "users/user-1/settings/ephemeral": false,
  });

  assert.equal(await repository.getUserEphemeral("user-1"), false);
});
