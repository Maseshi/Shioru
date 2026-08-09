const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { MessageFlags, MessageFlagsBitField } = require("discord.js");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const root = resolve(__dirname, "../..");
const target = resolve(root, "source/utils/consoleUtils.js");
const clientUtilsPath = resolve(root, "source/utils/clientUtils.js");

const loadCatchError = () =>
  requireWithMocks(target, {
    "firebase/app": { getApps: () => [] },
    [clientUtilsPath]: { webhookSend: () => undefined },
  }).catchError;

const createClient = () => ({
  configs: { logger: { error: { enable: false } } },
  i18n: { t: (key) => key },
  logger: { error: () => undefined, warn: () => undefined },
  ws: { ping: 10 },
});

const isEphemeral = (payload) =>
  new MessageFlagsBitField(payload.flags).has(MessageFlags.Ephemeral);

test("catchError replies ephemerally to a fresh interaction", async () => {
  const catchError = loadCatchError();
  let reply = null;
  const interaction = {
    content: undefined,
    createdTimestamp: Date.now(),
    deferred: false,
    replied: false,
    reply: async (payload) => {
      reply = payload;
    },
  };

  await catchError(createClient(), interaction, "test", new Error("failed"));

  assert.equal(isEphemeral(reply), true);
});

test("catchError replaces a public defer with an ephemeral follow-up", async () => {
  const catchError = loadCatchError();
  const calls = [];
  let followUp = null;
  const interaction = {
    content: undefined,
    createdTimestamp: Date.now(),
    deferred: true,
    ephemeral: false,
    replied: false,
    deleteReply: async () => calls.push("delete"),
    editReply: async () => calls.push("edit"),
    followUp: async (payload) => {
      calls.push("followUp");
      followUp = payload;
    },
  };

  await catchError(createClient(), interaction, "test", new Error("failed"));

  assert.deepEqual(calls, ["delete", "followUp"]);
  assert.equal(isEphemeral(followUp), true);
});

test("catchError edits an already-ephemeral deferred response", async () => {
  const catchError = loadCatchError();
  const calls = [];
  let edit = null;
  const interaction = {
    content: undefined,
    createdTimestamp: Date.now(),
    deferred: true,
    ephemeral: true,
    replied: false,
    editReply: async (payload) => {
      calls.push("edit");
      edit = payload;
    },
    followUp: async () => calls.push("followUp"),
  };

  await catchError(createClient(), interaction, "test", new Error("failed"));

  assert.deepEqual(calls, ["edit"]);
  assert.equal(isEphemeral(edit), true);
});
