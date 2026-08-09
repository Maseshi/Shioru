const assert = require("node:assert/strict");
const test = require("node:test");
const {
  normalizeNotification,
} = require("../../firebase/migrations/v1/notification");
const { runMigrations } = require("../../scripts/migrate");

test("database migration normalizes every legacy branch idempotently", () => {
  const migratedAt = new Date("2026-01-01T00:00:00.000Z");
  const legacy = {
    access: { "firebase-user": true },
    chat: {
      conversations: {
        0: { prompts: { 0: "hello" }, replies: { 0: "Hi!" } },
      },
      alternatives: { 0: "Continue" },
      system: "System",
    },
    users: {
      "user-1": {
        leveling: { exp: "10", level: 2.9 },
        guildLeveling: { "guild-1": { exp: "5", level: "1" } },
      },
    },
    guilds: {
      "guild-1": {
        name: "Guild",
        djs: { enable: true, roles: { 0: "role-1" } },
        notification: {
          general: {
            enable: true,
            channelId: "channel-1",
            embed: { createBy: "user-1" },
          },
        },
      },
    },
    leaderboards: {
      "guild-1": { "user-1": { exp: "10", level: 2.8 } },
    },
    issues: {
      bugs: {
        "issue-1": {
          title: "Bug",
          description: "Description",
          user: "User",
          uid: "user-1",
          reportedAt: "2025-01-01T00:00:00.000Z",
          status: { read: false, close: false, comment: false },
        },
      },
    },
  };

  const firstResult = runMigrations(legacy, migratedAt);
  const secondResult = runMigrations(firstResult.data, migratedAt);
  const first = firstResult.data;

  assert.deepEqual(secondResult.data, first);
  assert.deepEqual(firstResult.appliedVersions, [1]);
  assert.deepEqual(secondResult.appliedVersions, []);
  assert.equal(first.meta.schemaVersion, 1);
  assert.deepEqual(first.users["user-1"].leveling, { exp: 10, level: 2 });
  assert.deepEqual(first.leaderboards["guild-1"]["user-1"], {
    exp: 10,
    level: 2,
  });
  assert.equal(
    first.guilds["guild-1"].notification.general.embed.createdBy,
    "user-1",
  );
});

test("notification migration removes legacy names and fills embed structure", () => {
  const notification = normalizeNotification({
    enable: true,
    id: "channel-1",
    embed: { createBy: "user-1", fields: [] },
  });

  assert.equal(notification.channelId, "channel-1");
  assert.equal(notification.embed.createdBy, "user-1");
  assert.equal(notification.embed.fields.length, 2);
  assert.equal("createBy" in notification.embed, false);
});

test("database migration refuses unknown data instead of dropping it", () => {
  assert.throws(
    () =>
      runMigrations({
        guilds: { "guild-1": { name: "Guild", unknownSetting: true } },
      }),
    /unknown keys/,
  );
  assert.throws(() => runMigrations({ unknownRoot: true }), /unknown keys/);
});

test("migration script rejects unsupported schema versions", () => {
  assert.throws(
    () => runMigrations({ meta: { schemaVersion: 2 } }),
    /newer than supported/,
  );
  assert.throws(
    () => runMigrations({ meta: { schemaVersion: "1" } }),
    /nonnegative integer/,
  );
});
