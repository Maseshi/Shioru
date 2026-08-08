const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildBanAdd,
  once: false,
  async execute(ban) {
    const guildBanAddEmbed = new EmbedBuilder()
      .setTitle(ban.client.i18n.t("events.guildBanAdd.guild_notification"))
      .setDescription(
        ban.client.i18n
          .t("events.guildBanAdd.member_ban_add")
          .replace("%s1", ban.user.id)
          .replace("%s2", ban.reason),
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
