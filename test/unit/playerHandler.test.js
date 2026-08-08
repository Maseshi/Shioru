const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { Events } = require("distube");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const target = resolve(__dirname, "../../source/handlers/player.js");
const clientUtilsPath = require.resolve("../../source/utils/clientUtils");
const consoleUtilsPath = require.resolve("../../source/utils/consoleUtils");

const setup = () => {
  const callbacks = new Map();
  const calls = { catchError: [], errors: [], warnings: [], webhooks: [] };
  const handler = requireWithMocks(target, {
    [clientUtilsPath]: {
      changeLanguage: () => undefined,
      webhookSend: (...arguments_) => calls.webhooks.push(arguments_),
    },
    [consoleUtilsPath]: {
      catchError: async (...arguments_) => calls.catchError.push(arguments_),
    },
  });
  const client = {
    configs: { logger: { player: "webhook" } },
    i18n: { language: "en-US", t: (key) => key },
    logger: {
      error: (...arguments_) => calls.errors.push(arguments_),
      warn: (...arguments_) => calls.warnings.push(arguments_),
    },
    player: {
      on: (event, callback) => callbacks.set(event, callback),
      voices: new Map(),
    },
  };
  handler(client);
  return { callbacks, calls, client };
};

test("INIT_QUEUE applies deterministic queue defaults", () => {
  const { callbacks } = setup();
  const queue = {};
  callbacks.get(Events.INIT_QUEUE)(queue);
  assert.equal(queue.autoplay, false);
  assert.equal(queue.volume, 100);
  assert.equal(queue.filter, "clear");
  assert.ok(queue.createdTimestamp instanceof Date);
});

test("FINISH_SONG ignores missing songs and logs failed channel sends", async () => {
  const { callbacks, calls } = setup();
  callbacks.get(Events.FINISH_SONG)({}, null);
  assert.equal(calls.warnings.length, 1);

  const sendError = new Error("missing access");
  callbacks.get(Events.FINISH_SONG)(
    { textChannel: { send: async () => Promise.reject(sendError) } },
    { name: "Song", formattedDuration: "1:00" },
  );
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.errors[0][0].err, sendError);
});

test("ERROR handles unknown playlists without requiring queue or song data", async () => {
  const { callbacks, calls } = setup();
  callbacks.get(Events.ERROR)(
    new Error("Unknown Playlist"),
    undefined,
    undefined,
  );
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.catchError.length, 0);
});

test("ERROR leaves an existing voice connection and reports the failure", async () => {
  const { callbacks, calls, client } = setup();
  let leaveCalls = 0;
  const voiceChannel = { id: "voice" };
  client.player.voices.set(voiceChannel, {
    leave: () => {
      leaveCalls += 1;
    },
  });
  const error = new Error("ffmpeg failed");

  callbacks.get(Events.ERROR)(error, { voiceChannel }, null);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(leaveCalls, 1);
  assert.equal(calls.catchError[0][3], error);
});
