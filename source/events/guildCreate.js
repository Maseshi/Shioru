const { Events } = require("discord.js");
const { registeringCommands } = require("../utils/clientUtils");
const { synchronizeGuildData } = require("../utils/databaseUtils");
const { watchGuildData } = require("../utils/cacheUtils");

module.exports = {
  name: Events.GuildCreate,
  once: false,
  async execute(guild) {
    watchGuildData(guild.client, guild, (guildData) =>
      synchronizeGuildData(guild.client, guild, guildData),
    );
    registeringCommands(guild.client, true);
  },
};
