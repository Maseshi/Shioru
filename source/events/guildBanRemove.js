const { Events, EmbedBuilder } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildBanRemove,
  once: false,
  async execute(ban) {
    const guildBanRemoveEmbed = new EmbedBuilder()
      .setTitle(ban.client.i18n.t("events.guildBanRemove.guild_notification"))
      .setDescription(
        ban.client.i18n
          .t("events.guildBanRemove.member_ban_remove")
          .replace("%s1", ban.user.id)
          .replace("%s2", ban.reason),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(ban.client, ban.guild);
    await submitNotification(
      ban.client,
      ban.guild,
      Events.GuildBanRemove,
      guildBanRemoveEmbed,
    );
  },
};
