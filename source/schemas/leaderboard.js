const { LevelingSchema } = require("./leveling");

const LeaderboardEntrySchema = LevelingSchema;

const createLeaderboardEntry = (overrides = {}) =>
  LeaderboardEntrySchema.parse({ exp: 0, level: 0, ...overrides });

module.exports = { LeaderboardEntrySchema, createLeaderboardEntry };
