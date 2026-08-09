const { getDatabase, increment, ref } = require("firebase/database");
const {
  trackedGet: get,
  trackedSet: set,
  trackedUpdate: update,
} = require("../utils/metricsUtils");
const { StatisticsSchema } = require("../schemas/root");

const assertPath = (path) => {
  if (typeof path !== "string" || !path || path.startsWith("/"))
    throw new Error(`Invalid statistics path: ${path}`);
};

const getStatistics = async (path = "") => {
  const snapshot = await get(ref(getDatabase(), `statistics/${path}`));
  return snapshot.exists() ? snapshot.val() : null;
};

const updateStatistics = (section, values) => {
  assertPath(section);
  const parsed = StatisticsSchema.parse({ [section]: values });
  return update(ref(getDatabase(), `statistics/${section}`), parsed[section]);
};

const incrementStatistic = (path) => {
  assertPath(path);
  return set(ref(getDatabase(), `statistics/${path}`), increment(1));
};

const incrementStatistics = (paths) => {
  for (const path of paths) assertPath(path);
  const updates = Object.fromEntries(paths.map((path) => [path, increment(1)]));
  return update(ref(getDatabase(), "statistics"), updates);
};

module.exports = {
  getStatistics,
  incrementStatistic,
  incrementStatistics,
  updateStatistics,
};
