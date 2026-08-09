const configs = require("../configs/data");
const { logger } = require("./logUtils");

const systemMetricsSubmitter = () => {
  const apiKey = configs.monitoring.apiKey;
  const pageId = configs.monitoring.pageId;
  const metricId = configs.monitoring.metricId;
  if (!apiKey || !pageId || !metricId) return;

  const totalPoints = (60 / 5) * 24;
  const epochInSeconds = Math.floor(new Date() / 1000);
  const child = logger.child({}, { msgPrefix: "[SMSu] " });
  child.info("Sending system matrix data to status page...");

  const submitPoint = async (count) => {
    ++count;
    if (count > totalPoints)
      return child.info("Done, the matrix has been updated.");

    const currentTimestamp = epochInSeconds - (count - 1) * 5 * 60;
    const randomValue = Math.floor(Math.random() * 1000);

    try {
      await fetch(
        `https://api.statuspage.io/v1/pages/${pageId}/metrics/${metricId}/data.json`,
        {
          method: "POST",
          headers: {
            Authorization: `OAuth ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { timestamp: currentTimestamp, value: randomValue },
          }),
        },
      );
      child.info(
        `Testing processing submitted point ${count} of ${totalPoints}`,
      );
      setTimeout(() => submitPoint(count), 1000);
    } catch (error) {
      if (error.response?.status === 401) {
        child.error(
          "Error encountered. Please ensure that your page code and authorization key are correct.",
        );
      } else {
        child.error(
          error,
          "An error occurred while sending data to the matrix.",
        );
      }
    }
  };

  void submitPoint(0);
};

module.exports = { systemMetricsSubmitter };
