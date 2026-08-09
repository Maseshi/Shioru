const {
  createLeaderboardEntry,
  createLeveling,
  createUser,
} = require("../../../source/schemas/leveling");

const toNonnegativeNumber = (value) => Math.max(0, Number(value) || 0);
const toNonnegativeInteger = (value) =>
  Math.max(0, Math.trunc(Number(value) || 0));

const normalizeLeveling = (value = {}) =>
  createLeveling({
    exp: toNonnegativeNumber(value.exp),
    level: toNonnegativeInteger(value.level),
  });

const normalizeUser = (value = {}) =>
  createUser({
    ...value,
    leveling: normalizeLeveling(value.leveling),
    guildLeveling: Object.fromEntries(
      Object.entries(value.guildLeveling ?? {}).map(([guildId, leveling]) => [
        guildId,
        normalizeLeveling(leveling),
      ]),
    ),
    guilds: value.guilds ?? [],
  });

const normalizeLeaderboardEntry = (value = {}) =>
  createLeaderboardEntry(normalizeLeveling(value));

module.exports = {
  normalizeLeaderboardEntry,
  normalizeLeveling,
  normalizeUser,
};
