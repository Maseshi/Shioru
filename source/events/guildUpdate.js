const { Events } = require("discord.js");
const { synchronizeGuildData } = require("../services/guild");
const { getGuildData } = require("../utils/cacheUtils");

module.exports = {
  name: Events.GuildUpdate,
  once: false,
  async execute(_oldGuild, newGuild) {
    await synchronizeGuildData(
      newGuild.client,
      newGuild,
      getGuildData(newGuild.client, newGuild.id),
    );
  },
};
