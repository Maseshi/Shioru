const { z } = require("zod");

const IdentifierSchema = z.string().trim().min(1);
const StoredDateSchema = z
  .union([z.string(), z.date()])
  .transform((value) => (value instanceof Date ? value.toISOString() : value));
const NullableStoredDateSchema = z.union([StoredDateSchema, z.null()]);
const StringArraySchema = z.array(z.string());

const JsonValueSchema = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ]),
);

module.exports = {
  IdentifierSchema,
  JsonValueSchema,
  NullableStoredDateSchema,
  StoredDateSchema,
  StringArraySchema,
};
