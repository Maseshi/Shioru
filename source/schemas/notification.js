const { z } = require("zod");
const {
  IdentifierSchema,
  NullableStoredDateSchema,
  StoredDateSchema,
} = require("./common");

const NotificationAuthorSchema = z
  .object({ name: z.string(), url: z.string(), iconURL: z.string() })
  .strict();

const NotificationFieldSchema = z
  .object({ name: z.string(), value: z.string(), inline: z.boolean() })
  .strict();

const NotificationEditorSchema = z
  .object({ userId: IdentifierSchema, editedAt: StoredDateSchema })
  .strict();

const NotificationEmbedSchema = z
  .object({
    createdAt: StoredDateSchema,
    createdBy: z.string(),
    editor: z.array(NotificationEditorSchema).default([]),
    author: NotificationAuthorSchema,
    color: z.string(),
    title: z.string(),
    url: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    timestamp: NullableStoredDateSchema.optional(),
    image: z.string(),
    fields: z.array(NotificationFieldSchema).length(2),
    footer: z.object({ text: z.string(), iconURL: z.string() }).strict(),
  })
  .strict();

const NotificationSchema = z
  .object({
    enable: z.boolean(),
    channelId: z.string(),
    toggledAt: NullableStoredDateSchema.optional(),
    enabledAt: StoredDateSchema.optional(),
    content: z.string().optional(),
    embed: NotificationEmbedSchema.optional(),
  })
  .strict();

const NotificationMapSchema = z.record(IdentifierSchema, NotificationSchema);

const createNotificationEmbed = (overrides = {}) =>
  NotificationEmbedSchema.parse({
    createdAt: "",
    createdBy: "",
    editor: [],
    author: { name: "", url: "", iconURL: "" },
    color: "",
    title: "",
    url: "",
    description: "",
    thumbnail: "",
    timestamp: null,
    image: "",
    fields: [
      { name: "", value: "", inline: false },
      { name: "", value: "", inline: false },
    ],
    footer: { text: "", iconURL: "" },
    ...overrides,
  });

const createNotification = (overrides = {}) =>
  NotificationSchema.parse({
    enable: false,
    channelId: "",
    toggledAt: null,
    content: "",
    embed: createNotificationEmbed(),
    ...overrides,
  });

module.exports = {
  NotificationEmbedSchema,
  NotificationMapSchema,
  NotificationSchema,
  createNotification,
  createNotificationEmbed,
};
