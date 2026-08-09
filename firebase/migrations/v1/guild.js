const { createDjs, createGuild } = require("../../../source/schemas/guild");
const { normalizeChat } = require("./chat");
const { normalizeNotification } = require("./notification");

const objectValues = (value) =>
  Array.isArray(value) ? value : Object.values(value ?? {});
const toNonnegativeInteger = (value) =>
  Math.max(0, Math.trunc(Number(value) || 0));

const GUILD_KEYS = new Set([
  "joinedAt",
  "createdAt",
  "description",
  "iconURL",
  "preferredLocale",
  "memberCount",
  "name",
  "verified",
  "language",
  "antibot",
  "captcha",
  "afk",
  "chat",
  "djs",
  "notification",
]);

const normalizeGuild = (value = {}, guildId = "unknown") => {
  const unknownKeys = Object.keys(value).filter(
    (key) => !GUILD_KEYS.has(key),
  );
  if (unknownKeys.length)
    throw new Error(
      `guilds/${guildId} contains unknown keys: ${unknownKeys.join(", ")}`,
    );

  const optional = {};
  if (value.language) optional.language = value.language;
  if (value.antibot)
    optional.antibot = {
      enable: Boolean(value.antibot.enable),
      enabledAt: value.antibot.enabledAt ?? "",
      enabledBy: value.antibot.enabledBy ?? "unknown",
      bots: objectValues(value.antibot.bots),
      all: Boolean(value.antibot.all),
    };
  if (value.captcha)
    optional.captcha = {
      enable: Boolean(value.captcha.enable),
      role: value.captcha.role ?? "unknown",
      text: value.captcha.text ?? "captcha",
    };
  if (value.afk) optional.afk = value.afk;
  if (value.chat) optional.chat = normalizeChat(value.chat);
  if (value.djs)
    optional.djs = createDjs({
      enable: Boolean(value.djs.enable),
      toggledAt: value.djs.toggledAt ?? null,
      editedAt: value.djs.editedAt ?? null,
      only: Boolean(value.djs.only),
      roles: objectValues(value.djs.roles),
      users: objectValues(value.djs.users),
    });
  if (value.notification)
    optional.notification = Object.fromEntries(
      Object.entries(value.notification).map(([eventName, notification]) => [
        eventName,
        normalizeNotification(notification),
      ]),
    );

  return createGuild({
    joinedAt: value.joinedAt ?? "",
    createdAt: value.createdAt ?? "",
    description: value.description ?? "",
    iconURL: value.iconURL ?? "",
    preferredLocale: value.preferredLocale ?? "",
    memberCount: toNonnegativeInteger(value.memberCount),
    name: value.name ?? "",
    verified: Boolean(value.verified),
    ...optional,
  });
};

module.exports = { normalizeGuild };
