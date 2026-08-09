const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { loadRepository } = require("../helpers/repositoryMocks");

const target = resolve(__dirname, "../../source/repositories/guildSettings.js");

test("guild settings create complete validated records", async () => {
  const { repository, values } = loadRepository(target);

  await repository.updateLanguage("guild-1", { type: "CUSTOM", locale: "th" });
  await repository.updateDjs("guild-1", {
    enable: true,
    toggledAt: new Date("2026-01-01T00:00:00.000Z"),
  });
  await repository.updateCaptcha("guild-1", {
    enable: true,
    role: "role-1",
    text: "captcha",
  });
  await repository.updateNotification("guild-1", "general", {
    enable: true,
    channelId: "channel-1",
  });

  assert.deepEqual(values.get("guilds/guild-1/language"), {
    type: "CUSTOM",
    locale: "th",
  });
  assert.equal(values.get("guilds/guild-1/djs").only, false);
  assert.equal(
    values.get("guilds/guild-1/djs").toggledAt,
    "2026-01-01T00:00:00.000Z",
  );
  assert.equal(values.get("guilds/guild-1/captcha").role, "role-1");
  assert.equal(
    values.get("guilds/guild-1/notification/general").channelId,
    "channel-1",
  );
});

test("guild settings validate AFK and antibot values", async () => {
  const { repository, values } = loadRepository(target);

  await repository.setAfkEntry("guild-1", "user-1", {
    message: "Away",
    nickname: "User",
  });
  await repository.setAntibot("guild-1", {
    enable: true,
    enabledAt: new Date("2026-01-01T00:00:00.000Z"),
    enabledBy: "user-1",
    bots: [],
    all: true,
  });

  assert.equal(values.get("guilds/guild-1/afk/user-1").nickname, "User");
  assert.equal(
    values.get("guilds/guild-1/antibot").enabledAt,
    "2026-01-01T00:00:00.000Z",
  );
  assert.throws(() =>
    repository.setAfkEntry("guild-1", "user-2", {
      message: "Away",
      nickname: "",
    }),
  );
});
