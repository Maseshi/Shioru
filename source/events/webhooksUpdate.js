const { Events, EmbedBuilder } = require('discord.js')
const { submitNotification, initializeData } = require('../utils/databaseUtils')

module.exports = {
  name: Events.WebhooksUpdate,
  once: false,
  async execute(channel) {
    const hooks = await channel.fetchWebhooks()
    const webhookUpdateEmbed = new EmbedBuilder()
      .setTitle(
        channel.client.i18n.t('events.webhookUpdate.webhook_notification')
      )
      .setDescription(
        channel.client.i18n
          .t('events.webhookUpdate.webhook_update')
          .replace('%s1', hooks ? hooks.name : 'Webhook')
          .replace('%s2', channel.id)
      )
      .setThumbnail(hooks ? hooks.avatarURL() : '')
      .setTimestamp()
      .setColor('Yellow')

    await initializeData(channel.client, channel.guild)
    await submitNotification(
      channel.client,
      channel.guild,
      Events.WebhooksUpdate,
      webhookUpdateEmbed
    )
  },
}
