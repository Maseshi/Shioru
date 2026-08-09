const assert = require("node:assert/strict");
const test = require("node:test");
const { ChatSchema, createChat } = require("../../source/schemas/chat");
const {
  DjsSchema,
  GuildSchema,
  GuildUpdateSchema,
  createDjs,
  createGuild,
} = require("../../source/schemas/guild");
const { LevelingSchema } = require("../../source/schemas/leveling");
const {
  LeaderboardEntrySchema,
  createLeaderboardEntry,
} = require("../../source/schemas/leaderboard");
const {
  NotificationSchema,
  createNotification,
} = require("../../source/schemas/notification");
const { DatabaseRootSchema } = require("../../source/schemas/root");
const {
  AccessSchema,
  MaintenanceSchema,
} = require("../../source/schemas/system");
const {
  UserProfileSchema,
  UserSchema,
  createUser,
} = require("../../source/schemas/user");

test("database schema factories return independent compatible defaults", () => {
  const firstUser = createUser();
  const secondUser = createUser();
  firstUser.guilds.push("guild-1");

  assert.deepEqual(secondUser, {
    leveling: { exp: 0, level: 0 },
    guildLeveling: {},
    guilds: [],
  });
  assert.deepEqual(createLeaderboardEntry(), { exp: 0, level: 0 });
  assert.equal(GuildSchema.parse(createGuild()).memberCount, 0);
  assert.deepEqual(createDjs().roles, []);
  assert.equal(createNotification().embed.fields.length, 2);
});

test("database schemas reject invalid leveling values", () => {
  assert.throws(() => LevelingSchema.parse({ exp: -1, level: 0 }));
  assert.throws(() => LeaderboardEntrySchema.parse({ exp: -1, level: 0 }));
  assert.throws(() => LeaderboardEntrySchema.parse({ exp: 1, level: 0.5 }));
  assert.throws(() => UserSchema.parse({ leveling: { exp: "1", level: 0 } }));
});

test("domain schemas expose their write contracts", () => {
  assert.deepEqual(UserProfileSchema.parse({ username: "User" }), {
    username: "User",
  });
  assert.deepEqual(GuildUpdateSchema.parse({ memberCount: 1 }), {
    memberCount: 1,
  });
  assert.deepEqual(AccessSchema.parse({ "user-1": true }), { "user-1": true });
  assert.equal(MaintenanceSchema.parse(false), false);
});

test("user schema preserves legacy and custom user data", () => {
  const user = createUser({
    username: "Legacy user",
    guildLeveling: { "guild-1": { exp: 10, level: 2 } },
    custom: { retained: true },
  });

  assert.equal(user.guildLeveling["guild-1"].level, 2);
  assert.deepEqual(user.custom, { retained: true });
});

test("complete schemas validate chat, guild settings, and database roots", () => {
  const chat = createChat({
    conversations: [{ prompts: ["hello"], replies: ["Hi!"] }],
    alternatives: ["Continue"],
    system: "Be helpful",
  });
  const guild = createGuild({
    language: { type: "CUSTOM", locale: "th" },
    djs: createDjs({ enable: true, roles: ["role-1"] }),
    captcha: { enable: false, role: "role-1", text: "captcha" },
    afk: { "user-1": { message: "Away", nickname: "User" } },
    chat,
  });

  assert.equal(ChatSchema.parse(chat).conversations.length, 1);
  assert.equal(DjsSchema.parse(guild.djs).enable, true);
  assert.equal(NotificationSchema.parse(createNotification()).enable, false);
  assert.equal(
    DatabaseRootSchema.safeParse({ meta: { obsolete: true } }).success,
    false,
  );
  assert.throws(() => createGuild({ unknownSetting: true }));
});
