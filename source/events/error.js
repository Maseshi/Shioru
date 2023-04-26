const { Events } = require("discord.js");
const { logGenerator } = require("../utils/consoleUtils");

module.exports = {
    "name": Events.Error,
    "once": false,
    execute(error) {
        logGenerator("error", error);
        console.log(error);
    }
};