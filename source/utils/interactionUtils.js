const { MessageFlags, MessageFlagsBitField } = require("discord.js");

const addEphemeralFlag = (payload = {}) => {
  const options = typeof payload === "string" ? { content: payload } : payload;
  const flags = new MessageFlagsBitField(options.flags);
  flags.add(MessageFlags.Ephemeral);
  return { ...options, flags: flags.bitfield };
};

const enableEphemeralResponses = (interaction) => {
  for (const method of ["reply", "deferReply", "followUp"]) {
    if (typeof interaction[method] !== "function") continue;
    const original = interaction[method].bind(interaction);
    interaction[method] = (payload) => original(addEphemeralFlag(payload));
  }
};

module.exports = { addEphemeralFlag, enableEphemeralResponses };
