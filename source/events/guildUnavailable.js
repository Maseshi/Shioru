const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildUnavailable,
  once: false,
  async execute(guild) {
    const guildUnavailableEmbed = new EmbedBuilder()
      .setTitle(
        guild.client.i18n.t("events.guildUnavailable.guild_notification"),
      )
      .setDescription(
        guild.client.i18n.t("events.guildUnavailable.guild_unavailable"),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      guild.client,
      guild,
      Events.GuildUnavailable,
      guildUnavailableEmbed,
    );
  },
};
