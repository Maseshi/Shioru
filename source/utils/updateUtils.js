const { version } = require("../../package.json");
const configs = require("../configs/data");
const { logger } = require("./logUtils");

const updateChecker = async () => {
  const enable = configs.check_update.enable;
  const releasesURL = configs.check_update.releases_url;
  if (!enable || !releasesURL) return;

  const child = logger.child({}, { msgPrefix: "[UC] " });
  child.info("Checking for updates from Github...");

  try {
    const response = await fetch(releasesURL);
    if (response.status !== 200)
      child.warn("Unable to detect latest version at this time.");

    const data = await response.json();
    if (!data) return;

    if (version >= data.tag_name) {
      child.info("Currently using the latest version.");
    } else {
      child.info(`Update is available ${version} -> ${data.tag_name}).`);
      child.info("Run npm pull to update");
    }
  } catch (error) {
    child.error(error, "Failed to check for new updates");
  }
};

module.exports = { updateChecker };
