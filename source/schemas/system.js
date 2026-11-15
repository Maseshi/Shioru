const { z } = require("zod");
const { IdentifierSchema } = require("./common");

const AccessSchema = z.record(IdentifierSchema, z.boolean());
const MaintenanceSchema = z.union([
  z.boolean(),
  z
    .object({ enabled: z.boolean(), message: z.string().optional() })
    .passthrough(),
]);

module.exports = { AccessSchema, MaintenanceSchema };
