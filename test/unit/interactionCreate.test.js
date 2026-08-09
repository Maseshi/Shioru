const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const {
  Collection,
  MessageFlags,
  MessageFlagsBitField,
  PermissionsBitField,
} = require("discord.js");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const target = resolve(__dirname, "../../source/events/interactionCreate.js");
const clientUtilsPath = require.resolve("../../source/utils/clientUtils");
const consoleUtilsPath = require.resolve("../../source/utils/consoleUtils");
const levelingServicePath = require.resolve("../../source/services/leveling");
const statisticsServicePath =
  require.resolve("../../source/services/statistics");
const cacheUtilsPath = require.resolve("../../source/utils/cacheUtils");
const userRepositoryPath = require.resolve("../../source/repositories/user");

const setup = ({ ephemeral = false, guildData = null } = {}) => {
  const calls = {
    catchError: [],
    ephemeralReads: [],
    languages: [],
    levels: [],
    statistics: [],
  };
  const event = requireWithMocks(target, {
    [clientUtilsPath]: {
      changeLanguage: (_client, locale) => calls.languages.push(locale),
    },
    [consoleUtilsPath]: {
      catchError: async (...arguments_) => calls.catchError.push(arguments_),
    },
    [levelingServicePath]: {
      fetchLevel: async (...arguments_) => calls.levels.push(arguments_),
    },
    [statisticsServicePath]: {
      incrementStatistics: async (paths) => calls.statistics.push(paths),
    },
    [cacheUtilsPath]: { getGuildData: () => guildData },
    [userRepositoryPath]: {
      getUserEphemeral: async (userId) => {
        calls.ephemeralReads.push(userId);
        return ephemeral;
      },
    },
  });

  const warnings = [];
  const errors = [];
  const client = {
    commands: new Collection(),
    contexts: new Collection(),
    cooldowns: new Collection(),
    i18n: { t: (key) => key },
    logger: {
      warn: (value) => warnings.push(value),
      error: (...arguments_) => errors.push(arguments_),
    },
  };
  const interaction = {
    client,
    commandName: "ping",
    deferred: false,
    guildId: "guild-1",
    locale: "en-US",
    replied: false,
    user: { bot: false, id: "user-1" },
    guild: {
      members: { me: { permissions: new PermissionsBitField() } },
    },
    member: { send: async () => undefined },
    deferReply: async () => {
      interaction.deferred = true;
    },
    isAutocomplete: () => false,
    isChatInputCommand: () => true,
    isMessageContextMenuCommand: () => false,
    reply: async (payload) => payload,
  };
  return { calls, client, errors, event, interaction, warnings };
};

test("autocomplete executes its handler and ignores already-acknowledged errors", async () => {
  const { client, errors, event, interaction } = setup();
  interaction.isAutocomplete = () => true;
  client.commands.set("ping", {
    autocomplete: async () => {
      const error = new Error("expired");
      error.code = 10062;
      throw error;
    },
  });

  await event.execute(interaction);
  assert.equal(errors.length, 0);
});

test("chat commands defer once, select cached language, execute, and record activity", async () => {
  const { calls, client, event, interaction } = setup({
    guildData: { language: { type: "CUSTOM", locale: "th" } },
  });
  let executions = 0;
  client.commands.set("ping", {
    data: { name: "ping" },
    cooldown: 0,
    deferReply: true,
    execute: async () => {
      executions += 1;
    },
  });

  await event.execute(interaction);
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(interaction.deferred, true);
  assert.equal(executions, 1);
  assert.deepEqual(calls.languages, ["th"]);
  assert.equal(calls.levels.length, 1);
  assert.deepEqual(calls.statistics, [["size/worked", "commands/ping"]]);
});

test("active cooldown replies without executing the command", async () => {
  const { client, event, interaction } = setup();
  let executions = 0;
  let reply = null;
  const command = {
    data: { name: "ping" },
    cooldown: 60,
    execute: async () => {
      executions += 1;
    },
  };
  client.commands.set("ping", command);
  client.cooldowns.set("ping", new Collection([["user-1", Date.now()]]));
  interaction.reply = async (payload) => {
    reply = payload;
  };

  await event.execute(interaction);
  assert.equal(executions, 0);
  assert.equal(reply.ephemeral, true);
});

test("supported commands use the user's ephemeral response setting", async () => {
  const { calls, client, event, interaction } = setup({ ephemeral: true });
  let reply = null;
  client.commands.set("ping", {
    data: { name: "ping" },
    cooldown: 0,
    ephemeral: true,
    execute: async (commandInteraction) => {
      await commandInteraction.reply("private response");
    },
  });
  interaction.reply = async (payload) => {
    reply = payload;
  };

  await event.execute(interaction);

  assert.deepEqual(calls.ephemeralReads, ["user-1"]);
  assert.equal(reply.content, "private response");
  assert.equal(
    new MessageFlagsBitField(reply.flags).has(MessageFlags.Ephemeral),
    true,
  );
});

test("always-ephemeral commands do not read the user setting", async () => {
  const { calls, client, event, interaction } = setup();
  let deferredPayload = null;
  interaction.deferReply = async (payload) => {
    deferredPayload = payload;
    interaction.deferred = true;
  };
  client.commands.set("ping", {
    data: { name: "ping" },
    cooldown: 0,
    deferReply: true,
    ephemeral: "always",
    execute: async () => undefined,
  });

  await event.execute(interaction);

  assert.deepEqual(calls.ephemeralReads, []);
  assert.equal(
    new MessageFlagsBitField(deferredPayload.flags).has(MessageFlags.Ephemeral),
    true,
  );
});

test("missing bot permissions sends a direct message and skips execution", async () => {
  const { client, event, interaction } = setup();
  let directMessage = null;
  let executions = 0;
  client.commands.set("ping", {
    data: { name: "ping" },
    cooldown: 0,
    permissions: ["ManageGuild"],
    execute: async () => {
      executions += 1;
    },
  });
  interaction.member.send = async (payload) => {
    directMessage = payload;
  };

  await event.execute(interaction);
  assert.equal(executions, 0);
  assert.equal(directMessage.ephemeral, true);
});

test("command failures are routed to catchError", async () => {
  const { calls, client, event, interaction } = setup();
  const error = new Error("command failed");
  client.commands.set("ping", {
    data: { name: "ping" },
    cooldown: 0,
    execute: async () => {
      throw error;
    },
  });

  await event.execute(interaction);
  assert.equal(calls.catchError.length, 1);
  assert.equal(calls.catchError[0][3], error);
});
