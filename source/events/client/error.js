const { logGenerator } = require("../../utils/consoleUtils");

module.exports = (client, error) => {
    logGenerator("error", error);
};