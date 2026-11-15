const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.ChannelUpdate,
  once: false,
  async execute(oldChannel, newChannel) {
    const channelUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newChannel.client.i18n.t("events.channelUpdate.channel_notification"),
      )
      .setDescription(
        newChannel.client.i18n.t("events.channelUpdate.member_update_channel", {
          oldChannelName: oldChannel.name,
          newChannelId: newChannel.id,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      newChannel.client,
      newChannel.guild,
      Events.ChannelUpdate,
      channelUpdateEmbed,
    );
  },
};
