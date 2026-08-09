const { z } = require("zod");

const LevelingSchema = z
  .object({
    exp: z.number().finite().nonnegative(),
    level: z.number().int().nonnegative(),
  })
  .strict();

const createLeveling = (overrides = {}) =>
  LevelingSchema.parse({ exp: 0, level: 0, ...overrides });

module.exports = { LevelingSchema, createLeveling };
