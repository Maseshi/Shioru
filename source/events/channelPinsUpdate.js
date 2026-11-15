const { Events, EmbedBuilder } = require("discord.js");
const { submitNotification } = require("../services/notification");

module.exports = {
  name: Events.ChannelPinsUpdate,
  once: false,
  async execute(channel, time) {
    const channelPiusUpdateEmbed = new EmbedBuilder()
      .setTitle(
        channel.client.i18n.t("events.channelPinsUpdate.channel_notification"),
      )
      .setDescription(
        channel.client.i18n.t(
          "events.channelPinsUpdate.member_pins_in_channel",
          { channelId: channel.id, pinnedAt: time },
        ),
      )
      .setTimestamp()
      .setColor("Yellow");

    await submitNotification(
      channel.client,
      channel.guild,
      Events.ChannelPinsUpdate,
      channelPiusUpdateEmbed,
    );
  },
};
