const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const { describe, it } = require("node:test");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const root = resolve(__dirname, "../..");
const dependency = (path) => resolve(root, path);
const repositoryPath = dependency("source/repositories/guildSettings.js");
const firebaseMock = {
  child: (parent, name) => ({ path: `${parent.path}/${name}` }),
  getDatabase: () => ({}),
  ref: (_database, path) => ({ path }),
};

const makeInteraction = ({
  group = null,
  locale = "th",
  subcommand,
  values = {},
}) => {
  const replies = [];
  const interaction = {
    client: {
      i18n: {
        language: "en",
        options: { preload: ["en", "th"] },
        t: (key) => key,
      },
    },
    commandId: "command-id",
    commandName: "settings",
    guild: { id: "guild-id", preferredLocale: "th" },
    locale,
    options: {
      getBoolean: (name) => values[name] ?? null,
      getRole: (name) => values[name] ?? null,
      getString: (name) => values[name] ?? null,
      getSubcommand: () => subcommand,
      getSubcommandGroup: () => group,
      getUser: (name) => values[name] ?? null,
    },
    reply: async (payload) => replies.push(payload),
  };
  return { interaction, replies };
};

describe("language settings command behavior", () => {
  const loadLanguage = ({ changes, guildData, updates }) =>
    requireWithMocks(dependency("source/commands/settings/language.js"), {
      "firebase/database": firebaseMock,
      [dependency("source/schemas/guild.js")]: {
        createLanguage: () => ({ locale: "en", type: "CUSTOM" }),
      },
      [dependency("source/utils/cacheUtils.js")]: {
        getGuildData: () => guildData,
      },
      [dependency("source/utils/clientUtils.js")]: {
        changeLanguage: (_client, locale) => changes.push(locale),
      },
      [repositoryPath]: {
        updateLanguage: async (_guildId, value) =>
          updates.push({
            ref: { path: "guilds/guild-id/language" },
            value,
          }),
      },
    });

  it("rejects unknown and already active locales without updating storage", async () => {
    const updates = [];
    const command = loadLanguage({ changes: [], guildData: {}, updates });
    const unknown = makeInteraction({
      subcommand: "set",
      values: { locale: "jp" },
    });
    const active = makeInteraction({
      subcommand: "set",
      values: { locale: "en" },
    });

    await command.execute(unknown.interaction);
    await command.execute(active.interaction);

    assert.deepEqual(unknown.replies, ["commands.language.language_not_found"]);
    assert.deepEqual(active.replies, ["commands.language.already_set"]);
    assert.equal(updates.length, 0);
  });

  it("stores a custom locale and changes the runtime language", async () => {
    const changes = [];
    const updates = [];
    const command = loadLanguage({
      changes,
      guildData: { language: { locale: "en", type: "CUSTOM" } },
      updates,
    });
    const state = makeInteraction({
      subcommand: "set",
      values: { locale: "th" },
    });

    await command.execute(state.interaction);

    assert.deepEqual(updates[0].value, { locale: "th" });
    assert.equal(updates[0].ref.path, "guilds/guild-id/language");
    assert.deepEqual(changes, ["th"]);
    assert.deepEqual(state.replies, ["commands.language.changed_locale"]);
  });

  it("switches language source to the invoking user's locale", async () => {
    const changes = [];
    const updates = [];
    const command = loadLanguage({ changes, guildData: {}, updates });
    const state = makeInteraction({
      subcommand: "by",
      values: { type: "USER" },
    });

    await command.execute(state.interaction);

    assert.deepEqual(updates[0].value, { type: "USER" });
    assert.deepEqual(changes, ["th"]);
    assert.deepEqual(state.replies, ["commands.language.changed_type"]);
  });
});

describe("DJ settings command behavior", () => {
  const loadDjs = ({ djs, updates }) =>
    requireWithMocks(dependency("source/commands/settings/djs.js"), {
      "firebase/database": firebaseMock,
      [dependency("source/utils/cacheUtils.js")]: {
        getGuildDjs: () => ({
          ...djs,
          roles: [...djs.roles],
          users: [...djs.users],
        }),
      },
      [repositoryPath]: {
        updateDjs: async (_guildId, value) =>
          updates.push({ ref: { path: "guilds/guild-id/djs" }, value }),
      },
    });

  it("enables DJ mode once and persists the toggle", async () => {
    const updates = [];
    const command = loadDjs({
      djs: { enable: false, only: false, roles: [], users: [] },
      updates,
    });
    const state = makeInteraction({ subcommand: "enable" });

    await command.execute(state.interaction);

    assert.equal(updates[0].ref.path, "guilds/guild-id/djs");
    assert.equal(updates[0].value.enable, true);
    assert.ok(updates[0].value.toggledAt instanceof Date);
    assert.deepEqual(state.replies, ["commands.djs.enable_djs_mode"]);
  });

  it("does not write when DJ mode already has the requested state", async () => {
    const updates = [];
    const command = loadDjs({
      djs: { enable: true, only: false, roles: [], users: [] },
      updates,
    });
    const state = makeInteraction({ subcommand: "enable" });

    await command.execute(state.interaction);

    assert.equal(updates.length, 0);
    assert.deepEqual(state.replies, ["commands.djs.currently_enabled"]);
  });

  it("adds roles and rejects duplicate role assignments", async () => {
    const role = { id: "dj-role" };
    const addedUpdates = [];
    const addCommand = loadDjs({
      djs: { enable: true, only: true, roles: [], users: [] },
      updates: addedUpdates,
    });
    const added = makeInteraction({
      group: "roles",
      subcommand: "add",
      values: { name: role },
    });
    const duplicateUpdates = [];
    const duplicateCommand = loadDjs({
      djs: { enable: true, only: true, roles: [role.id], users: [] },
      updates: duplicateUpdates,
    });
    const duplicate = makeInteraction({
      group: "roles",
      subcommand: "add",
      values: { name: role },
    });

    await addCommand.execute(added.interaction);
    await duplicateCommand.execute(duplicate.interaction);

    assert.deepEqual(addedUpdates[0].value.roles, [role.id]);
    assert.deepEqual(added.replies, ["commands.djs.added_role"]);
    assert.equal(duplicateUpdates.length, 0);
    assert.deepEqual(duplicate.replies, [
      "commands.djs.role_have_been_added_before",
    ]);
  });

  it("clearing the final DJ user also disables DJ mode", async () => {
    const updates = [];
    const command = loadDjs({
      djs: { enable: true, only: true, roles: [], users: ["dj-user"] },
      updates,
    });
    const state = makeInteraction({ group: "users", subcommand: "clear" });

    await command.execute(state.interaction);

    assert.deepEqual(
      updates.map(({ value }) => value),
      [{ editedAt: updates[0].value.editedAt, users: [] }, { enable: false }],
    );
    assert.deepEqual(state.replies, ["commands.djs.cleared_users_in_list"]);
  });
});
