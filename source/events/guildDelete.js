const { Events } = require("discord.js");
const { fetchStatistics } = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildDelete,
  once: false,
  async execute(guild) {
    await fetchStatistics("POST", "size", guild.client);
  },
};
