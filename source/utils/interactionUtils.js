const {
  MessageFlags,
  MessageFlagsBitField,
  MessagePayload,
} = require("discord.js");

const withEphemeralFlag = (options = {}) => ({
  ...options,
  flags: new MessageFlagsBitField(options.flags).add(MessageFlags.Ephemeral)
    .bitfield,
});

const addEphemeralFlag = (payload = {}) => {
  if (typeof payload === "string")
    return withEphemeralFlag({ content: payload });
  // Keep MessagePayload instances intact so discord.js still recognizes them.
  if (payload instanceof MessagePayload) {
    payload.options = withEphemeralFlag(payload.options);
    return payload;
  }
  return withEphemeralFlag(payload);
};

const enableEphemeralResponses = (interaction) => {
  for (const method of ["reply", "deferReply", "followUp"]) {
    if (typeof interaction[method] !== "function") continue;
    const original = interaction[method].bind(interaction);
    interaction[method] = (payload) => original(addEphemeralFlag(payload));
  }
};

module.exports = { addEphemeralFlag, enableEphemeralResponses };
