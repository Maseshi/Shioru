const { z } = require("zod");
const { IdentifierSchema, StoredDateSchema } = require("./common");

const IssueStatusSchema = z
  .object({ read: z.boolean(), close: z.boolean(), comment: z.boolean() })
  .strict();

const IssueSchema = z
  .object({
    title: z.string().min(1),
    description: z.string(),
    user: z.string(),
    uid: IdentifierSchema,
    reportedAt: StoredDateSchema,
    status: IssueStatusSchema,
  })
  .strict();

const IssuesSchema = z
  .object({
    bugs: z.record(IdentifierSchema, IssueSchema).optional(),
    features: z.record(IdentifierSchema, IssueSchema).optional(),
  })
  .strict();

const createIssue = (overrides = {}) =>
  IssueSchema.parse({
    title: "Untitled",
    description: "",
    user: "",
    uid: "unknown",
    reportedAt: new Date(0),
    status: { read: false, close: false, comment: false },
    ...overrides,
  });

module.exports = { IssueSchema, IssuesSchema, createIssue };
