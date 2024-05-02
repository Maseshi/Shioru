const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.ManageMessages,
  ],
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete a lot of messages')
    .setDescriptionLocalizations({
      th: 'ลบข้อความจำนวนมาก',
    })
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ReadMessageHistory |
        PermissionFlagsBits.ManageMessages
    )
    .setDMPermission(true)
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of messages to delete')
        .setDescriptionLocalizations({
          th: 'จำนวนข้อความที่จะลบ',
        })
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    const inputAmount = interaction.options.getInteger('amount')

    const previousMessages = await interaction.channel.messages.fetch({
      limit: 1,
    })

    try {
      const messages = await interaction.channel.messages.fetch({
        limit: inputAmount,
        before: previousMessages.first().id,
      })

      await interaction.channel.bulkDelete(messages, true)
      await interaction.reply(
        interaction.client.i18n
          .t('commands.purge.message_cleared')
          .replace('%s', messages.size)
      )
    } catch (error) {
      catchError(
        interaction.client,
        interaction,
        module.exports.data.name,
        error
      )
    }
  },
}
