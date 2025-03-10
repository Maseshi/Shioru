const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageMessages,
  ],
  data: new SlashCommandBuilder()
    .setName('crosspost')
    .setDescription(
      'Publishes a message in an announcement channel to all channels following it.'
    )
    .setDescriptionLocalizations({
      th: 'เผยแพร่ข้อความในช่องประกาศไปยังทุกช่องที่ติดตาม',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('ID of message to be published')
        .setDescriptionLocalizations({ th: 'ไอดีของข้อความที่ต้องการเผยแพร่' })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputID = interaction.options.getString('id')

    if (interaction.channel.type !== ChannelType.GuildAnnouncement)
      return await interaction.reply({
        content: interaction.client.i18n.t(
          'commands.crosspost.is_not_valid_type'
        ),
        ephemeral: true,
      })

    try {
      const message = await interaction.channel.messages.fetch(inputID)

      if (!message)
        return await interaction.reply({
          content: interaction.client.i18n.t(
            'commands.crosspost.message_not_found'
          ),
          ephemeral: true,
        })
      if (!message.crosspostable)
        return await interaction.reply({
          content: interaction.client.i18n.t(
            'commands.crosspost.can_not_published'
          ),
          ephemeral: true,
        })

      await message.crosspost()
    } catch (error) {
      catchError(
        interaction.client,
        interaction,
        module.exports.data.name,
        error
      )
    }

    await interaction.reply({
      content: interaction.client.i18n.t('commands.crosspost.published'),
      ephemeral: true,
    })
  },
}
