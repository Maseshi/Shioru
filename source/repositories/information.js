const { getDatabase, ref } = require("firebase/database");
const { trackedUpdate: update } = require("../utils/metricsUtils");
const { InformationSchema } = require("../schemas/root");

const updateInformation = (section, values) => {
  const parsed = InformationSchema.parse({ [section]: values });
  return update(ref(getDatabase(), `information/${section}`), parsed[section]);
};

module.exports = { updateInformation };
