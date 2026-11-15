const { LimitedCollection } = require("discord.js");
const { getUserEphemeral, setUserEphemeral } = require("../repositories/user");

// Discord allows 3 seconds to acknowledge an interaction; leave most of it for the command.
const READ_TIMEOUT_MS = 1_000;
const MAX_CACHED_USERS = 10_000;

const getCache = (client) => {
  if (!client.ephemeralSettings)
    client.ephemeralSettings = new LimitedCollection({
      maxSize: MAX_CACHED_USERS,
    });
  return client.ephemeralSettings;
};

const readWithTimeout = (userId) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Timed out reading the ephemeral setting.")),
      READ_TIMEOUT_MS,
    );
  });
  return Promise.race([getUserEphemeral(userId), timeout]).finally(() =>
    clearTimeout(timer),
  );
};

/**
 * Resolves whether a user's responses should be ephemeral.
 * Falls back to private when the setting cannot be read, so failures never expose output.
 */
const resolveEphemeral = async (client, userId) => {
  const cache = getCache(client);
  if (cache.has(userId)) return cache.get(userId);

  try {
    const enabled = await readWithTimeout(userId);
    cache.set(userId, enabled);
    return enabled;
  } catch (error) {
    client.logger.error(
      { err: error, userId },
      "Failed to load the user's ephemeral setting; defaulting to private.",
    );
    return true;
  }
};

const updateEphemeral = async (client, userId, enabled) => {
  const stored = await setUserEphemeral(userId, enabled);
  getCache(client).set(userId, stored);

  if (client.shard) {
    try {
      await client.shard.broadcastEval(
        (shardClient, context) =>
          void shardClient.ephemeralSettings?.set(
            context.userId,
            context.enabled,
          ),
        { context: { enabled: stored, userId } },
      );
    } catch (error) {
      client.logger.warn(
        { err: error, userId },
        "Failed to sync the ephemeral setting to other shards.",
      );
    }
  }

  return stored;
};

module.exports = { READ_TIMEOUT_MS, resolveEphemeral, updateEphemeral };
