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

test("syncUserProfile initializes a user and its profile cache", async () => {
  const { calls, repository, values } = loadRepository(target);
  const cache = {};
  const profile = {
    username: "Schema user",
    avatar: "https://cdn.test/user.png",
  };

  await repository.syncUserProfile(cache, "user-1", profile);

  assert.equal(calls[0][0], "transaction");
  assert.equal(calls[0][1], "users/user-1");
  assert.equal(values.get("users/user-1").username, "Schema user");
  assert.equal(cache.schemaUsers.has("user-1"), true);
  assert.equal(
    cache.userProfiles.get("user-1"),
    "Schema user:https://cdn.test/user.png",
  );
});

test("syncUserProfile skips an unchanged cached profile", async () => {
  const { calls, repository } = loadRepository(target);
  const cache = {
    schemaUsers: new Set(["user-1"]),
    userProfiles: new Map([
      ["user-1", "Schema user:https://cdn.test/user.png"],
    ]),
  };

  await repository.syncUserProfile(cache, "user-1", {
    username: "Schema user",
    avatar: "https://cdn.test/user.png",
  });

  assert.deepEqual(calls, []);
});

test("syncUserProfile persists a changed cached profile", async () => {
  const { calls, repository } = loadRepository(target);
  const cache = {
    schemaUsers: new Set(["user-1"]),
    userProfiles: new Map([["user-1", "Schema user:old-avatar"]]),
  };

  await repository.syncUserProfile(cache, "user-1", {
    username: "Schema user",
    avatar: "https://cdn.test/user.png",
  });

  assert.deepEqual(calls[0], [
    "update",
    "users/user-1",
    {
      username: "Schema user",
      avatar: "https://cdn.test/user.png",
    },
  ]);
  assert.equal(
    cache.userProfiles.get("user-1"),
    "Schema user:https://cdn.test/user.png",
  );
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
