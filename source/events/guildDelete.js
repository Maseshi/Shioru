const { Events } = require("discord.js");
const { unwatchGuildData } = require("../utils/cacheUtils");

module.exports = {
  name: Events.GuildDelete,
  once: false,
  execute(guild) {
    unwatchGuildData(guild.client, guild.id);
  },
};
