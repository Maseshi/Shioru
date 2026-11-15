const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildBanRemove,
  once: false,
  async execute(ban) {
    const guildBanRemoveEmbed = new EmbedBuilder()
      .setTitle(ban.client.i18n.t("events.guildBanRemove.guild_notification"))
      .setDescription(
        ban.client.i18n.t("events.guildBanRemove.member_ban_remove", {
          userId: ban.user.id,
          reason: ban.reason,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      ban.client,
      ban.guild,
      Events.GuildBanRemove,
      guildBanRemoveEmbed,
    );
  },
};
