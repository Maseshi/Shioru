const { Events, EmbedBuilder } = require('discord.js')
const { submitNotification, initializeData } = require('../utils/databaseUtils')

module.exports = {
  name: Events.ThreadDelete,
  once: false,
  async execute(thread) {
    const threadDeleteEmbed = new EmbedBuilder()
      .setTitle(thread.client.i18n.t('events.threadDelete.thread_notification'))
      .setDescription(
        thread.client.i18n
          .t('events.threadDelete.thread_delete')
          .replace('%s', thread.name)
      )
      .setTimestamp()
      .setColor('Yellow')

    await initializeData(thread.client, thread.guild)
    await submitNotification(
      thread.client,
      thread.guild,
      Events.ThreadDelete,
      threadDeleteEmbed
    )
  },
}
