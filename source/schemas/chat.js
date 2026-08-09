const { z } = require("zod");
const { StringArraySchema } = require("./common");

const ConversationSchema = z
  .object({
    prompts: StringArraySchema,
    replies: StringArraySchema.min(1),
    script: z.string().optional(),
  })
  .strict();

const ChatSchema = z
  .object({
    conversations: z.array(ConversationSchema),
    alternatives: StringArraySchema,
    system: z.string(),
  })
  .strict();

const createChat = (overrides = {}) =>
  ChatSchema.parse({
    conversations: [],
    alternatives: [],
    system: "",
    ...overrides,
  });

module.exports = { ChatSchema, ConversationSchema, createChat };
