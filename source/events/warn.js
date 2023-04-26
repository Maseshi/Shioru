const { Events } = require("discord.js");
const { logGenerator } = require("../utils/consoleUtils");

module.exports = {
    "name": Events.Warn,
    "once": false,
    execute(info) {
        logGenerator("warn", info);
        console.warn(info);
    }
};