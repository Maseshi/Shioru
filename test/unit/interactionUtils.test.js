const assert = require("node:assert/strict");
const test = require("node:test");
const {
  MessageFlags,
  MessageFlagsBitField,
  MessagePayload,
} = require("discord.js");
const {
  addEphemeralFlag,
  enableEphemeralResponses,
} = require("../../source/utils/interactionUtils");

const hasFlag = (flags, flag) => new MessageFlagsBitField(flags).has(flag);

test("addEphemeralFlag wraps string content", () => {
  const payload = addEphemeralFlag("hello");

  assert.equal(payload.content, "hello");
  assert.equal(hasFlag(payload.flags, MessageFlags.Ephemeral), true);
});

test("addEphemeralFlag keeps existing flags", () => {
  const payload = addEphemeralFlag({
    content: "hello",
    flags: MessageFlags.SuppressEmbeds,
  });

  assert.equal(hasFlag(payload.flags, MessageFlags.Ephemeral), true);
  assert.equal(hasFlag(payload.flags, MessageFlags.SuppressEmbeds), true);
});

test("addEphemeralFlag keeps MessagePayload instances usable", () => {
  const original = new MessagePayload({}, { content: "hello" });
  const payload = addEphemeralFlag(original);

  assert.equal(payload, original);
  assert.equal(payload instanceof MessagePayload, true);
  assert.equal(payload.options.content, "hello");
  assert.equal(hasFlag(payload.options.flags, MessageFlags.Ephemeral), true);
});

test("enableEphemeralResponses applies the flag to every response method", async () => {
  const sent = [];
  const interaction = {
    deferReply: async (payload) => sent.push(payload),
    followUp: async (payload) => sent.push(payload),
    reply: async (payload) => sent.push(payload),
  };

  enableEphemeralResponses(interaction);
  await interaction.reply("a");
  await interaction.deferReply();
  await interaction.followUp({ content: "b" });

  assert.equal(sent.length, 3);
  for (const payload of sent)
    assert.equal(hasFlag(payload.flags, MessageFlags.Ephemeral), true);
});
