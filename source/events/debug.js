const { Events } = require("discord.js");
const { logGenerator } = require("../utils/consoleUtils");

module.exports = {
    "name": Events.Debug,
    "once": false,
    execute(info) {
        logGenerator("debug", info);
    }
};