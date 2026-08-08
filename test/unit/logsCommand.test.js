const assert = require("node:assert/strict");
const { rmSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");
const { test } = require("node:test");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const commandPath = require.resolve("../../source/commands/developer/logs");
const logUtilsPath = require.resolve("../../source/utils/logUtils");

const loadCommand = ({ files = [], path = null } = {}) =>
  requireWithMocks(commandPath, {
    [logUtilsPath]: {
      findLogFile: () => (path ? { path } : null),
      formatLogDate: () => "2026-08-09",
      listLogFiles: () => files,
    },
  });

const makeInteraction = ({
  date = null,
  developer = [],
  owner = "owner-id",
  subcommand = "list",
  type = null,
  userId = "owner-id",
} = {}) => {
  const replies = [];
  return {
    interaction: {
      client: {
        configs: { team: { developer, owner } },
        i18n: { t: (key) => key },
      },
      options: {
        getString: (name) => ({ date, type })[name],
        getSubcommand: () => subcommand,
      },
      reply: async (payload) => replies.push(payload),
      user: { id: userId },
    },
    replies,
  };
};

test("logs command rejects users outside the configured team", async () => {
  const state = makeInteraction({ userId: "unknown" });

  await loadCommand().execute(state.interaction);

  assert.equal(
    state.replies[0].content,
    "commands.logs.only_owner_and_developers",
  );
});

test("logs command lists the latest bounded daily files", async () => {
  const files = Array.from({ length: 30 }, (_, index) => ({
    name: `app.2026-08-${String(30 - index).padStart(2, "0")}.log`,
    size: 1024,
  }));
  const state = makeInteraction({
    developer: ["developer-id"],
    userId: "developer-id",
  });

  await loadCommand({ files }).execute(state.interaction);

  assert.match(state.replies[0].content, /app\.2026-08-30\.log/);
  assert.doesNotMatch(state.replies[0].content, /app\.2026-08-05\.log/);
});

test("logs command downloads a requested daily file", async () => {
  const file = join(tmpdir(), `shioru-log-command-${process.pid}.log`);
  writeFileSync(file, "error detail");
  try {
    const state = makeInteraction({ subcommand: "get", type: "error" });

    await loadCommand({ path: file }).execute(state.interaction);

    assert.equal(state.replies[0].files.length, 1);
    assert.equal(state.replies[0].content, "commands.logs.found_file");
  } finally {
    rmSync(file, { force: true });
  }
});

test("logs command deletes only a validated requested file", async () => {
  const file = join(tmpdir(), `shioru-log-delete-${process.pid}.log`);
  writeFileSync(file, "old log");
  const state = makeInteraction({ subcommand: "delete", type: "app" });

  await loadCommand({ path: file }).execute(state.interaction);

  assert.equal(state.replies[0].content, "commands.logs.file_has_been_deleted");
  assert.throws(() => require("node:fs").statSync(file), { code: "ENOENT" });
});
