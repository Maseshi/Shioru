const { z } = require("zod");
const { IdentifierSchema } = require("./common");
const { LevelingSchema, createLeveling } = require("./leveling");

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

const UserProfileSchema = UserSchema.pick({
  username: true,
  avatar: true,
}).strict();

const createUser = (overrides = {}) =>
  UserSchema.parse({
    leveling: createLeveling(),
    guildLeveling: {},
    guilds: [],
    ...overrides,
  });

module.exports = {
  UserGuildsSchema,
  UserProfileSchema,
  UserSchema,
  UserSettingsSchema,
  createUser,
};
