const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildMembersChunk,
  once: false,
  async execute(_members, guild, _chunk) {
    const guildMembersChunkEmbed = new EmbedBuilder()
      .setTitle(
        guild.client.i18n.t("events.guildMembersChunk.guild_notification"),
      )
      .setDescription(
        guild.client.i18n
          .t("events.guildMembersChunk.guild_members_chunk")
          .replace("%s", guild.name),
      )
      .setImage(guild.bannerURL())
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      guild.client,
      guild,
      Events.GuildMembersChunk,
      guildMembersChunkEmbed,
    );
  },
};
