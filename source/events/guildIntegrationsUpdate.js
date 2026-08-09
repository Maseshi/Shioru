const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildIntegrationsUpdate,
  once: false,
  async execute(guild) {
    const guildIntegrationsUpdateEmbed = new EmbedBuilder()
      .setTitle(
        guild.client.i18n.t(
          "events.guildIntegrationsUpdate.guild_notification",
        ),
      )
      .setDescription(
        guild.client.i18n.t(
          "events.guildIntegrationsUpdate.guild_integrations_update",
          { guildName: guild.name },
        ),
      )
      .setImage(guild.bannerURL())
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      guild.client,
      guild,
      Events.GuildIntegrationsUpdate,
      guildIntegrationsUpdateEmbed,
    );
  },
};
