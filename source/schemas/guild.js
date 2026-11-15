const { z } = require("zod");
const {
  IdentifierSchema,
  NullableStoredDateSchema,
  StoredDateSchema,
} = require("./common");
const { ChatSchema } = require("./chat");
const { NotificationMapSchema } = require("./notification");

const LanguageSchema = z
  .object({
    type: z.enum(["USER", "GUILD", "CUSTOM"]),
    locale: z.string().min(1),
  })
  .strict();

const DjsSchema = z
  .object({
    enable: z.boolean(),
    toggledAt: NullableStoredDateSchema.optional(),
    editedAt: NullableStoredDateSchema.optional(),
    only: z.boolean(),
    roles: z.array(IdentifierSchema).default([]),
    users: z.array(IdentifierSchema).default([]),
  })
  .strict();

const AntibotSchema = z
  .object({
    enable: z.boolean(),
    enabledAt: StoredDateSchema,
    enabledBy: IdentifierSchema,
    bots: z.array(IdentifierSchema).default([]),
    all: z.boolean(),
  })
  .strict();

const CaptchaSchema = z
  .object({
    enable: z.boolean(),
    role: IdentifierSchema,
    text: z.string().min(1),
  })
  .strict();

const AfkEntrySchema = z
  .object({ message: z.string(), nickname: z.string().min(1) })
  .strict();
const AfkMapSchema = z.record(IdentifierSchema, AfkEntrySchema);

const GuildSchema = z
  .object({
    joinedAt: z.string(),
    createdAt: z.string(),
    description: z.string(),
    iconURL: z.string(),
    preferredLocale: z.string(),
    memberCount: z.number().int().nonnegative(),
    name: z.string(),
    verified: z.boolean(),
    language: LanguageSchema.optional(),
    antibot: AntibotSchema.optional(),
    captcha: CaptchaSchema.optional(),
    afk: AfkMapSchema.optional(),
    chat: ChatSchema.optional(),
    djs: DjsSchema.optional(),
    notification: NotificationMapSchema.optional(),
  })
  .strict();
const GuildUpdateSchema = GuildSchema.partial().strict();

const createLanguage = (overrides = {}) =>
  LanguageSchema.parse({ type: "USER", locale: "en-US", ...overrides });

const createDjs = (overrides = {}) =>
  DjsSchema.parse({
    enable: false,
    toggledAt: null,
    editedAt: null,
    only: false,
    roles: [],
    users: [],
    ...overrides,
  });

const createGuild = (overrides = {}) =>
  GuildSchema.parse({
    joinedAt: "",
    createdAt: "",
    description: "",
    iconURL: "",
    preferredLocale: "",
    memberCount: 0,
    name: "",
    verified: false,
    ...overrides,
  });

module.exports = {
  AfkEntrySchema,
  AfkMapSchema,
  AntibotSchema,
  CaptchaSchema,
  DjsSchema,
  GuildSchema,
  GuildUpdateSchema,
  LanguageSchema,
  createDjs,
  createGuild,
  createLanguage,
};
