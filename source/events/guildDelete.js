const { Events } = require("discord.js");
const { unwatchGuildData } = require("../services/guildCache");

module.exports = {
  name: Events.GuildDelete,
  once: false,
  execute(guild) {
    unwatchGuildData(guild.client, guild.id);
  },
};
