const { Events, EmbedBuilder, Colors } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildMemberUpdate,
  once: false,
  async execute(oldMember, newMember) {
    const guildMemberUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newMember.client.i18n.t("events.guildMemberUpdate.guild_notification"),
      )
      .setDescription(
        newMember.client.i18n.t(
          "events.guildMemberUpdate.guild_member_updated",
          {
            old_member:
              oldMember.user.tag ||
              newMember.client.i18n.t("events.guildMemberUpdate.unknown"),
            new_member: newMember.user.tag,
          },
        ),
      )
      .setImage(newMember.guild.bannerURL())
      .setTimestamp()
      .setColor(Colors.Blue);

    await submitNotification(
      newMember.client,
      newMember.guild,
      module.exports.name,
      guildMemberUpdateEmbed,
    );
  },
};
