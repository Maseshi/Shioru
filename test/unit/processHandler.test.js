const assert = require("node:assert/strict");
const test = require("node:test");
const { createShutdownHandler } = require("../../source/handlers/process");

const createClient = ({ destroy } = {}) => {
  const calls = { destroyed: 0, errors: [], logs: [], unsubscribed: 0 };
  const client = {
    destroy: async () => {
      calls.destroyed += 1;
      if (destroy) await destroy();
    },
    guildSettings: new Map([["guild", { language: "th" }]]),
    logger: {
      error: (...arguments_) => calls.errors.push(arguments_),
      info: (...arguments_) => calls.logs.push(arguments_),
    },
    temp: {
      intervals: new Set(["timer-1", "timer-2"]),
      listeners: new Map([
        [
          "guild:guild",
          () => {
            calls.unsubscribed += 1;
          },
        ],
      ]),
    },
  };
  return { calls, client };
};

test("shutdown clears timers, listeners, cache, destroys once, and exits cleanly", async () => {
  const { calls, client } = createClient();
  const cleared = [];
  const exits = [];
  const shutdown = createShutdownHandler(client, {
    clearTimer: (timer) => cleared.push(timer),
    exit: (code) => exits.push(code),
  });

  await Promise.all([shutdown("SIGTERM"), shutdown("SIGINT")]);

  assert.deepEqual(cleared, ["timer-1", "timer-2"]);
  assert.equal(calls.unsubscribed, 1);
  assert.equal(client.temp.intervals.size, 0);
  assert.equal(client.temp.listeners.size, 0);
  assert.equal(client.guildSettings.size, 0);
  assert.equal(calls.destroyed, 1);
  assert.deepEqual(exits, [0]);
  assert.equal(calls.logs[0][0].reason, "SIGTERM");
});

test("shutdown logs destroy failures and still exits", async () => {
  const failure = new Error("destroy failed");
  const { calls, client } = createClient({
    destroy: async () => {
      throw failure;
    },
  });
  const exits = [];
  const shutdown = createShutdownHandler(client, {
    clearTimer: () => undefined,
    exit: (code) => exits.push(code),
  });

  await shutdown("disconnect");
  assert.equal(calls.errors[0][0], failure);
  assert.deepEqual(exits, [0]);
});
