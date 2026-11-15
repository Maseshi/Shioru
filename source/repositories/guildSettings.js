const { child } = require("firebase/database");
const {
  trackedRemove: remove,
  trackedRunTransaction: runTransaction,
  trackedSet: set,
} = require("../utils/metricsUtils");
const {
  AfkEntrySchema,
  AntibotSchema,
  CaptchaSchema,
  DjsSchema,
  LanguageSchema,
  createDjs,
  createLanguage,
} = require("../schemas/guild");
const {
  NotificationSchema,
  createNotification,
} = require("../schemas/notification");
const { getGuildRef: guildRef } = require("./guild");

const updateLanguage = (guildId, patch) =>
  runTransaction(child(guildRef(guildId), "language"), (current) =>
    LanguageSchema.parse({ ...createLanguage(), ...(current ?? {}), ...patch }),
  );

const updateDjs = (guildId, patch) =>
  runTransaction(child(guildRef(guildId), "djs"), (current) =>
    DjsSchema.parse({ ...createDjs(), ...(current ?? {}), ...patch }),
  );

const setAntibot = (guildId, value) =>
  set(child(guildRef(guildId), "antibot"), AntibotSchema.parse(value));

const updateCaptcha = (guildId, patch) =>
  runTransaction(child(guildRef(guildId), "captcha"), (current) =>
    CaptchaSchema.parse({ ...(current ?? {}), ...patch }),
  );

const setAfkEntry = (guildId, userId, value) =>
  set(child(guildRef(guildId), `afk/${userId}`), AfkEntrySchema.parse(value));

const removeGuildSetting = (guildId, setting) => {
  const removableSettings = [
    "afk",
    "antibot",
    "captcha",
    "chat",
    "djs",
    "notification",
  ];
  if (!removableSettings.includes(setting))
    throw new Error(`Unsupported removable guild setting: ${setting}`);
  return remove(child(guildRef(guildId), setting));
};

const removeAfkEntry = (guildId, userId) =>
  remove(child(guildRef(guildId), `afk/${userId}`));

const updateNotification = (guildId, eventName, patch) =>
  runTransaction(
    child(guildRef(guildId), `notification/${eventName}`),
    (current) =>
      NotificationSchema.parse({
        ...(current ?? createNotification()),
        ...patch,
      }),
  );

const removeNotification = (guildId, eventName) =>
  remove(child(guildRef(guildId), `notification/${eventName}`));

module.exports = {
  removeAfkEntry,
  removeGuildSetting,
  removeNotification,
  setAfkEntry,
  setAntibot,
  updateCaptcha,
  updateDjs,
  updateLanguage,
  updateNotification,
};
