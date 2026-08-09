const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const root = resolve(__dirname, "../..");
const commandPath = resolve(root, "source/commands/settings/ephemeral.js");
const repositoryPath = resolve(root, "source/repositories/user.js");

const setup = ({ current = false, subcommand = "get" } = {}) => {
  const replies = [];
  const updates = [];
  const command = requireWithMocks(commandPath, {
    [repositoryPath]: {
      getUserEphemeral: async () => current,
      setUserEphemeral: async (userId, enabled) => {
        updates.push({ enabled, userId });
        return enabled;
      },
    },
  });
  const interaction = {
    client: {
      i18n: {
        t: (key, values) => (values ? { key, values } : key),
      },
    },
    options: { getSubcommand: () => subcommand },
    reply: async (payload) => replies.push(payload),
    user: { id: "user-1" },
  };
  return { command, interaction, replies, updates };
};

test("get reports the current ephemeral setting", async () => {
  const state = setup({ current: true });

  await state.command.execute(state.interaction);

  assert.equal(state.replies[0].key, "commands.ephemeral.current");
  assert.equal(
    state.replies[0].values.status,
    "commands.ephemeral.status_enabled",
  );
  assert.deepEqual(state.updates, []);
});

test("enable stores the user's ephemeral setting", async () => {
  const state = setup({ subcommand: "enable" });

  await state.command.execute(state.interaction);

  assert.deepEqual(state.updates, [{ enabled: true, userId: "user-1" }]);
  assert.deepEqual(state.replies, ["commands.ephemeral.enabled"]);
});

test("disable clears the user's ephemeral setting", async () => {
  const state = setup({ subcommand: "disable" });

  await state.command.execute(state.interaction);

  assert.deepEqual(state.updates, [{ enabled: false, userId: "user-1" }]);
  assert.deepEqual(state.replies, ["commands.ephemeral.disabled"]);
});
