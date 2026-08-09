const { z } = require("zod");
const { IdentifierSchema, JsonValueSchema } = require("./common");
const { ChatSchema } = require("./chat");
const { GuildSchema } = require("./guild");
const { IssuesSchema } = require("./issue");
const { LeaderboardEntrySchema, UserSchema } = require("./leveling");

const InformationSchema = z.record(z.string(), JsonValueSchema);

const StatisticsValueSchema = z.lazy(() =>
  z.union([
    z.number().finite().nonnegative(),
    z.record(z.string(), StatisticsValueSchema),
  ]),
);
const StatisticsSchema = z.record(z.string(), StatisticsValueSchema);
const AccessSchema = z.record(IdentifierSchema, z.boolean());
const MaintenanceSchema = z.union([
  z.boolean(),
  z
    .object({ enabled: z.boolean(), message: z.string().optional() })
    .passthrough(),
]);
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
  AccessSchema,
  DatabaseRootSchema,
  InformationSchema,
  MaintenanceSchema,
  StatisticsSchema,
};
