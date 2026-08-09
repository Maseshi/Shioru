const {
  getStatistics,
  incrementStatistic,
  incrementStatistics: incrementStatisticsInRepository,
  updateStatistics,
} = require("../repositories/statistics");

const fetchStatistics = async (method, path, client) => {
  if (method === "GET" && path === "size") return getStatistics(path);
  if (method !== "POST") return undefined;

  if (path === "size") {
    const commandSize = client.commands.size ?? 0;
    let guildSize = client.guilds.cache.size ?? 0;
    let userSize = client.users.cache.size ?? 0;

    if (client.shard?.count && process.connected !== false) {
      const [guildCounts, userCounts] = await Promise.all([
        client.shard.fetchClientValues("guilds.cache.size"),
        client.shard.fetchClientValues("users.cache.size"),
      ]);
      guildSize = guildCounts.reduce((total, count) => total + count, 0);
      userSize = userCounts.reduce((total, count) => total + count, 0);
    }

    return updateStatistics(path, {
      commands: commandSize,
      guilds: guildSize,
      users: userSize,
    });
  }

  if (
    path === "size/worked" ||
    path.startsWith("command") ||
    path.startsWith("context")
  ) {
    return incrementStatistic(path);
  }

  client.logger.warn(`Unknown post path at ${path}`);
  return undefined;
};

const incrementStatistics = (paths) => incrementStatisticsInRepository(paths);

module.exports = { fetchStatistics, incrementStatistics };
