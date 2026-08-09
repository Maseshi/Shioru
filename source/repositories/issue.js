const { getDatabase, ref } = require("firebase/database");
const { trackedPush: push } = require("../utils/metricsUtils");
const { IssueSchema } = require("../schemas/issue");

const pushIssue = (type, value) => {
  if (!["bugs", "features"].includes(type))
    throw new Error(`Unsupported issue type: ${type}`);
  return push(ref(getDatabase(), `issues/${type}`), IssueSchema.parse(value));
};

module.exports = { pushIssue };
