const { createIssue } = require("../../../source/schemas/issue");
const {
  DatabaseRootSchema,
  InformationSchema,
  StatisticsSchema,
} = require("../../../source/schemas/root");
const { normalizeChat } = require("./chat");
const { normalizeGuild } = require("./guild");
const { normalizeLeaderboardEntry, normalizeUser } = require("./user");

const ROOT_KEYS = new Set([
  "meta",
  "maintenance",
  "access",
  "information",
  "statistics",
  "chat",
  "issues",
  "users",
  "guilds",
  "leaderboards",
]);

const normalizeRecord = (record, normalizeValue) =>
  Object.fromEntries(
    Object.entries(record ?? {}).map(([key, value]) => [
      key,
      normalizeValue(value, key),
    ]),
  );

const version = 1;

const migrate = (value = {}, migratedAt = new Date()) => {
  const unknownKeys = Object.keys(value).filter((key) => !ROOT_KEYS.has(key));
  if (unknownKeys.length)
    throw new Error(
      `database root contains unknown keys: ${unknownKeys.join(", ")}`,
    );

  const normalized = {
    ...value,
    meta: { schemaVersion: version, migratedAt },
  };

  if (value.chat) normalized.chat = normalizeChat(value.chat);
  if (value.information)
    normalized.information = InformationSchema.parse(value.information);
  if (value.statistics)
    normalized.statistics = StatisticsSchema.parse(value.statistics);
  if (value.users)
    normalized.users = normalizeRecord(value.users, normalizeUser);
  if (value.guilds)
    normalized.guilds = normalizeRecord(value.guilds, normalizeGuild);
  if (value.leaderboards)
    normalized.leaderboards = normalizeRecord(value.leaderboards, (entries) =>
      normalizeRecord(entries, normalizeLeaderboardEntry),
    );
  if (value.issues)
    normalized.issues = normalizeRecord(value.issues, (entries) =>
      normalizeRecord(entries, createIssue),
    );

  return DatabaseRootSchema.parse(normalized);
};

module.exports = { migrate, version };
