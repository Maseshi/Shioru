const { Events, EmbedBuilder } = require('discord.js')
const { submitNotification, initializeData } = require('../utils/databaseUtils')

module.exports = {
  name: Events.ChannelUpdate,
  once: false,
  async execute(oldChannel, newChannel) {
    const channelUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newChannel.client.i18n.t('events.channelUpdate.channel_notification')
      )
      .setDescription(
        newChannel.client.i18n
          .t('events.channelUpdate.member_update_channel')
          .replace('%s1', oldChannel.name)
          .replace('%s2', newChannel.id)
      )
      .setTimestamp()
      .setColor('Yellow')

    await initializeData(newChannel.client, newChannel.guild)
    await submitNotification(
      newChannel.client,
      newChannel.guild,
      Events.ChannelUpdate,
      channelUpdateEmbed
    )
  },
}
