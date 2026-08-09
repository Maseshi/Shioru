const { z } = require("zod");

const StatisticsValueSchema = z.lazy(() =>
  z.union([
    z.number().finite().nonnegative(),
    z.record(z.string(), StatisticsValueSchema),
  ]),
);
const StatisticsSchema = z.record(z.string(), StatisticsValueSchema);

module.exports = { StatisticsSchema, StatisticsValueSchema };
