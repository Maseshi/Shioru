const {
  createNotification,
  createNotificationEmbed,
} = require("../../../source/schemas/notification");

const objectValues = (value) =>
  Array.isArray(value) ? value : Object.values(value ?? {});

const normalizeNotificationEmbed = (value = {}) => {
  const fields = objectValues(value.fields).slice(0, 2);
  while (fields.length < 2) fields.push({ name: "", value: "", inline: false });

  return createNotificationEmbed({
    createdAt: value.createdAt ?? "",
    createdBy: value.createdBy ?? value.createBy ?? "",
    editor: objectValues(value.editor),
    author: {
      name: value.author?.name ?? "",
      url: value.author?.url ?? "",
      iconURL: value.author?.iconURL ?? "",
    },
    color: value.color ?? "",
    title: value.title ?? "",
    url: value.url ?? "",
    description: value.description ?? "",
    thumbnail: value.thumbnail ?? "",
    timestamp: value.timestamp ?? null,
    image: value.image ?? "",
    fields: fields.map((field) => ({
      name: field?.name ?? "",
      value: field?.value ?? "",
      inline: Boolean(field?.inline),
    })),
    footer: {
      text: value.footer?.text ?? "",
      iconURL: value.footer?.iconURL ?? "",
    },
  });
};

const normalizeNotification = (value = {}) => {
  const normalized = createNotification({
    enable: Boolean(value.enable),
    channelId: value.channelId ?? value.id ?? "",
    toggledAt: value.toggledAt ?? null,
    ...(value.enabledAt == null ? {} : { enabledAt: value.enabledAt }),
    ...(value.content == null ? {} : { content: value.content }),
    ...(value.embed ? { embed: normalizeNotificationEmbed(value.embed) } : {}),
  });

  if (value.content == null) delete normalized.content;
  if (!value.embed) delete normalized.embed;
  return normalized;
};

module.exports = { normalizeNotification, normalizeNotificationEmbed };
