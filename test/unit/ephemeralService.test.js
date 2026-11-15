const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { requireWithMocks } = require("../helpers/requireWithMocks");

const target = resolve(__dirname, "../../source/services/ephemeral.js");
const repositoryPath = require.resolve("../../source/repositories/user");

const setup = ({ read = async () => false, write } = {}) => {
  const reads = [];
  const writes = [];
  const service = requireWithMocks(target, {
    [repositoryPath]: {
      getUserEphemeral: (userId) => {
        reads.push(userId);
        return read(userId);
      },
      setUserEphemeral:
        write ??
        (async (userId, enabled) => {
          writes.push({ enabled, userId });
          return enabled;
        }),
    },
  });
  const errors = [];
  const warnings = [];
  const client = {
    logger: {
      error: (...arguments_) => errors.push(arguments_),
      warn: (...arguments_) => warnings.push(arguments_),
    },
  };
  return { client, errors, reads, service, warnings, writes };
};

test("resolveEphemeral reads once and serves later calls from the cache", async () => {
  const { client, reads, service } = setup({ read: async () => false });

  assert.equal(await service.resolveEphemeral(client, "user-1"), false);
  assert.equal(await service.resolveEphemeral(client, "user-1"), false);
  assert.deepEqual(reads, ["user-1"]);
});

test("resolveEphemeral defaults to private when the read fails", async () => {
  const { client, errors, service } = setup({
    read: async () => {
      throw new Error("offline");
    },
  });

  assert.equal(await service.resolveEphemeral(client, "user-1"), true);
  assert.equal(errors.length, 1);
  assert.equal(client.ephemeralSettings.has("user-1"), false);
});

test("resolveEphemeral defaults to private when the read is too slow", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { client, service } = setup({
    read: () => new Promise(() => undefined),
  });

  const pending = service.resolveEphemeral(client, "user-1");
  t.mock.timers.tick(service.READ_TIMEOUT_MS);

  assert.equal(await pending, true);
  assert.equal(client.ephemeralSettings.has("user-1"), false);
});

test("updateEphemeral stores the value and refreshes the local cache", async () => {
  const { client, reads, service, writes } = setup();

  assert.equal(await service.updateEphemeral(client, "user-1", true), true);
  assert.deepEqual(writes, [{ enabled: true, userId: "user-1" }]);
  assert.equal(await service.resolveEphemeral(client, "user-1"), true);
  assert.deepEqual(reads, []);
});

test("updateEphemeral syncs the value to every shard", async () => {
  const { client, service } = setup();
  const otherShard = { ephemeralSettings: new Map([["user-1", false]]) };
  client.shard = {
    broadcastEval: async (script, { context }) => [
      script(client, context),
      script(otherShard, context),
    ],
  };

  await service.updateEphemeral(client, "user-1", true);

  assert.equal(otherShard.ephemeralSettings.get("user-1"), true);
});

test("updateEphemeral keeps the stored value when shard sync fails", async () => {
  const { client, service, warnings } = setup();
  client.shard = {
    broadcastEval: async () => {
      throw new Error("shard respawning");
    },
  };

  assert.equal(await service.updateEphemeral(client, "user-1", false), false);
  assert.equal(client.ephemeralSettings.get("user-1"), false);
  assert.equal(warnings.length, 1);
});
