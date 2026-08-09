const { z } = require("zod");
const { JsonValueSchema } = require("./common");

const InformationSchema = z.record(z.string(), JsonValueSchema);

module.exports = { InformationSchema };
