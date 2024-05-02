const { Events, EmbedBuilder } = require('discord.js')
const { submitNotification, initializeData } = require('../utils/databaseUtils')

module.exports = {
  name: Events.ChannelCreate,
  once: false,
  async execute(channel) {
    const channelCreateEmbed = new EmbedBuilder()
      .setTitle(
        channel.client.i18n.t('events.channelCreate.channel_notification')
      )
      .setDescription(
        channel.client.i18n
          .t('events.channelCreate.member_create_channel')
          .replace('%s', channel.id)
      )
      .setTimestamp()
      .setColor('Yellow')

    await initializeData(channel.client, channel.guild)
    await submitNotification(
      channel.client,
      channel.guild,
      Events.ChannelCreate,
      channelCreateEmbed
    )
  },
}
