const { onGuild } = require("../repositories/guild");
const { recordMetricsCache } = require("./metricsUtils");

const ensureCache = (client) => {
  if (!client.guildSettings) client.guildSettings = new Map();
  if (!client.temp.listeners) client.temp.listeners = new Map();
};

const getGuildData = (client, guildId) => {
  if (!guildId) return null;
  ensureCache(client);
  const guildData = client.guildSettings.get(guildId) ?? null;
  recordMetricsCache(guildData !== null);
  return guildData;
};

const getGuildDjs = (client, guildId) => {
  const djs = {
    ...client.configs.djs,
    ...(getGuildData(client, guildId)?.djs ?? {}),
  };

  return {
    ...djs,
    roles: [...(djs.roles ?? [])],
    users: [...(djs.users ?? [])],
  };
};

const watchGuildData = (client, guild, synchronize) => {
  ensureCache(client);

  const listenerKey = `guild:${guild.id}`;
  if (client.temp.listeners.has(listenerKey)) return;

  let isInitialSnapshot = true;
  const unsubscribe = onGuild(
    guild.id,
    (guildData) => {
      if (guildData) client.guildSettings.set(guild.id, guildData);
      else client.guildSettings.delete(guild.id);

      if (!isInitialSnapshot) return;
      isInitialSnapshot = false;
      if (typeof synchronize !== "function") return;

      void Promise.resolve(synchronize(guildData)).catch((error) =>
        client.logger.error(
          { err: error, guildId: guild.id },
          "Failed to synchronize cached guild data.",
        ),
      );
    },
    (error) =>
      client.logger.error(
        { err: error, guildId: guild.id },
        "Guild data listener failed.",
      ),
  );

  client.temp.listeners.set(listenerKey, unsubscribe);
};

const unwatchGuildData = (client, guildId) => {
  ensureCache(client);

  const listenerKey = `guild:${guildId}`;
  const unsubscribe = client.temp.listeners.get(listenerKey);
  if (unsubscribe) unsubscribe();

  client.temp.listeners.delete(listenerKey);
  client.guildSettings.delete(guildId);
};

module.exports = {
  getGuildData,
  getGuildDjs,
  watchGuildData,
  unwatchGuildData,
};
