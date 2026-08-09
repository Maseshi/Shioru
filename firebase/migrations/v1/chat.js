const { createChat } = require("../../../source/schemas/chat");

const objectValues = (value) =>
  Array.isArray(value) ? value : Object.values(value ?? {});

const normalizeChat = (value = {}) =>
  createChat({
    conversations: objectValues(value.conversations).map((conversation) => ({
      prompts: objectValues(conversation?.prompts),
      replies: objectValues(conversation?.replies),
      ...(conversation?.script == null ? {} : { script: conversation.script }),
    })),
    alternatives: objectValues(value.alternatives),
    system: value.system ?? "",
  });

module.exports = { normalizeChat };
