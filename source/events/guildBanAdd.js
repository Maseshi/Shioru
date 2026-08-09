const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildBanAdd,
  once: false,
  async execute(ban) {
    const guildBanAddEmbed = new EmbedBuilder()
      .setTitle(ban.client.i18n.t("events.guildBanAdd.guild_notification"))
      .setDescription(
        ban.client.i18n.t("events.guildBanAdd.member_ban_add", {
          userId: ban.user.id,
          reason: ban.reason,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      ban.client,
      ban.guild,
      Events.GuildBanAdd,
      guildBanAddEmbed,
    );
  },
};
