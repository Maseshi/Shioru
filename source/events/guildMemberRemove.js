const { Events, EmbedBuilder } = require("discord.js");
const { updateGuildMemberCount } = require("../services/guild");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member) {
    void updateGuildMemberCount(member.guild).catch((error) =>
      member.client.logger.error(
        { err: error, guildId: member.guild.id },
        "Failed to update guild member count.",
      ),
    );

    if (member.user.bot) return;

    const memberFetch = await member.user.fetch();
    const memberColor = memberFetch.accentColor;
    const memberTag = member.user.tag;
    const memberAvatar = member.user.displayAvatarURL();
    const guildMemberRemoveEmbed = new EmbedBuilder()
      .setTitle(memberTag)
      .setDescription(
        member.client.i18n.t("events.guildMemberRemove.user_has_exited"),
      )
      .setTimestamp()
      .setColor(memberColor)
      .setThumbnail(memberAvatar);

    await submitNotification(
      member.client,
      member.guild,
      Events.GuildMemberRemove,
      guildMemberRemoveEmbed,
    );
  },
};
