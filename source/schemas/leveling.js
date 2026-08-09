const { z } = require("zod");
const { IdentifierSchema } = require("./common");

const LevelingSchema = z
  .object({
    exp: z.number().finite().nonnegative(),
    level: z.number().int().nonnegative(),
  })
  .strict();

const UserGuildsSchema = z.union([
  z.array(IdentifierSchema),
  z.record(IdentifierSchema, z.literal(true)),
]);

const UserSettingsSchema = z
  .object({
    ephemeral: z.boolean(),
  })
  .strict();

const UserSchema = z
  .object({
    username: z.string().optional(),
    avatar: z.string().optional(),
    leveling: LevelingSchema,
    guildLeveling: z.record(IdentifierSchema, LevelingSchema).optional(),
    guilds: UserGuildsSchema.optional(),
    settings: UserSettingsSchema.optional(),
  })
  .passthrough();

const LeaderboardEntrySchema = LevelingSchema;

const createLeveling = (overrides = {}) =>
  LevelingSchema.parse({ exp: 0, level: 0, ...overrides });

const createUser = (overrides = {}) =>
  UserSchema.parse({
    leveling: createLeveling(),
    guildLeveling: {},
    guilds: [],
    ...overrides,
  });

const createLeaderboardEntry = (overrides = {}) =>
  LeaderboardEntrySchema.parse({ exp: 0, level: 0, ...overrides });

module.exports = {
  LeaderboardEntrySchema,
  LevelingSchema,
  UserSchema,
  UserSettingsSchema,
  createLeaderboardEntry,
  createLeveling,
  createUser,
};
