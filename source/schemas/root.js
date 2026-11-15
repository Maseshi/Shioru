const { z } = require("zod");
const { IdentifierSchema } = require("./common");
const { ChatSchema } = require("./chat");
const { GuildSchema } = require("./guild");
const { InformationSchema } = require("./information");
const { IssuesSchema } = require("./issue");
const { LeaderboardEntrySchema } = require("./leaderboard");
const { StatisticsSchema } = require("./statistics");
const { AccessSchema, MaintenanceSchema } = require("./system");
const { UserSchema } = require("./user");
const DatabaseRootSchema = z
  .object({
    maintenance: MaintenanceSchema.optional(),
    access: AccessSchema.optional(),
    information: InformationSchema.optional(),
    statistics: StatisticsSchema.optional(),
    chat: ChatSchema.optional(),
    issues: IssuesSchema.optional(),
    users: z.record(IdentifierSchema, UserSchema).optional(),
    guilds: z.record(IdentifierSchema, GuildSchema).optional(),
    leaderboards: z
      .record(
        IdentifierSchema,
        z.record(IdentifierSchema, LeaderboardEntrySchema),
      )
      .optional(),
  })
  .strict();

module.exports = {
  DatabaseRootSchema,
};
