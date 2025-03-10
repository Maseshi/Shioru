const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildDelete,
  once: false,
  execute(guild) {
    fetchStatistics("POST", "size", guild.client);
  },
};
