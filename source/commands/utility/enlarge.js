const {
  SlashCommandBuilder,
  parseEmoji,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.AttachFiles,
  ],
  data: new SlashCommandBuilder()
    .setName('enlarge')
    .setDescription('Enlarge the emoji.')
    .setDescriptionLocalizations({ th: 'ขยายอิโมจิให้ใหญ่ขึ้น' })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('The emoji you want to be enlarged')
        .setDescriptionLocalizations({
          th: 'อีโมจิที่ต้องการให้ขยายให้ใหญ่ขึ้น',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputEmoji = interaction.options.getString('emoji')

    const parsedEmoji = parseEmoji(inputEmoji)

    if (parsedEmoji.id) {
      const fileType = inputEmoji.animated ? 'gif' : 'png'
      const emojiURL = `https://cdn.discordapp.com/emojis/${parsedEmoji.id}.${fileType}`

      await interaction.reply({ files: [emojiURL] })
    } else {
      await interaction.reply(
        interaction.client.i18n.t('commands.enlarge.emoji_not_found')
      )
    }
  },
}
