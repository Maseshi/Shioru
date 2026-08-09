const configs = require("../configs/data");
const { logger } = require("./logUtils");

const submitTopGGStatistics = async (
  client,
  {
    fetchImpl = fetch,
    statisticsLogger = logger.child({}, { msgPrefix: "[STSu] " }),
    topGGToken = configs.top_gg_token,
  } = {},
) => {
  if (!topGGToken) return false;
  if (
    client.shards.size === 0 ||
    ![...client.shards.values()].every((shard) => shard.ready)
  )
    return false;

  try {
    const results = await client.fetchClientValues("guilds.cache.size");
    const guildCount = results.reduce((acc, count) => acc + count, 0);
    const shardCount = results.length;
    const response = await fetchImpl("https://top.gg/api/bots/stats", {
      method: "POST",
      headers: {
        Authorization: topGGToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server_count: guildCount,
        shard_count: shardCount,
      }),
    });

    if (!response.ok) {
      statisticsLogger.warn(
        {
          url: response.url,
          status: { id: response.status, text: response.statusText },
        },
        "Unable to post statistical data to Top.gg.",
      );
      return false;
    }

    statisticsLogger.info(
      { guildCount, shardCount },
      "Posted statistics data to Top.gg.",
    );
    return true;
  } catch (error) {
    statisticsLogger.error(
      error,
      "An error occurred while sending statistics data to Top.gg.",
    );
    return false;
  }
};

const statisticsSubmitter = (
  client,
  {
    intervalMs = 1800000,
    setIntervalImpl = setInterval,
    topGGToken = configs.top_gg_token,
    ...submitOptions
  } = {},
) => {
  if (!topGGToken) return null;

  const submit = () =>
    submitTopGGStatistics(client, { ...submitOptions, topGGToken });
  void submit();
  return setIntervalImpl(() => void submit(), intervalMs);
};

module.exports = { statisticsSubmitter, submitTopGGStatistics };
