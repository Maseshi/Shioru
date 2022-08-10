const { logGenerator } = require("../../utils/consoleUtils");

module.exports = (client, info) => {
    logGenerator("debug", info);
};