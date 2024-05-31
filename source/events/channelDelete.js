const { Events, EmbedBuilder } = require('discord.js')
const { submitNotification, initializeData } = require('../utils/databaseUtils')

module.exports = {
  name: Events.ChannelDelete,
  once: false,
  async execute(channel) {
    const channelDeleteEmbed = new EmbedBuilder()
      .setTitle(
        channel.client.i18n.t('events.channelDelete.channel_notification')
      )
      .setDescription(
        channel.client.i18n
          .t('events.channelDelete.member_delete_channel')
          .replace('%s', channel.name)
      )
      .setTimestamp()
      .setColor('Yellow')

    await initializeData(channel.client, channel.guild)
    await submitNotification(
      channel.client,
      channel.guild,
      Events.ChannelDelete,
      channelDeleteEmbed
    )
  },
}
