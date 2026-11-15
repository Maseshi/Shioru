const assert = require("node:assert/strict");
const test = require("node:test");
const ping = require("../../source/commands/developer/ping");

test("ping reports the reply API time, not time spent before replying", async () => {
  const edits = [];
  const interaction = {
    client: {
      i18n: {
        t: (key, values) => (values ? JSON.stringify({ key, values }) : key),
      },
      ws: { ping: 42 },
    },
    // Simulates a slow handler: the interaction was created long before the reply.
    createdTimestamp: Date.now() - 60_000,
    editReply: async (payload) => edits.push(payload),
    reply: async () => undefined,
  };

  await ping.execute(interaction);

  const info = JSON.parse(edits[0].embeds[0].data.description);
  assert.equal(info.key, "commands.ping.info");
  assert.equal(info.values.websocket_latency, 42);
  assert.ok(info.values.roundtrip_latency < 1_000);
});
