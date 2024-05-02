const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js')
const { translate } = require('@vitalets/google-translate-api')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text')
    .setDescriptionLocalizations({
      th: 'แปลภาษาข้อความ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('to')
        .setDescription('Country code for translation')
        .setDescriptionLocalizations({
          th: 'รหัสประเทศสำหรับการแปลภาษา',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('the text to be translated')
        .setDescriptionLocalizations({
          th: 'ข้อความที่ต้องการจะแปล',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputTo = interaction.options.getString('to')
    const inputMessage = interaction.options.getString('message')

    if (!interaction.client.configs.translation[inputTo])
      return await interaction.reply({
        content: interaction.client.i18n
          .t('commands.translate.translate_support')
          .replace(
            '%s',
            Object.keys(interaction.client.configs.translation).join(', ')
          ),
        ephemeral: true,
      })

    const response = await translate(inputMessage, { to: inputTo })

    if (!response)
      return await interaction.reply({
        content: interaction.client.i18n.t(
          'commands.translate.can_not_translate'
        ),
        ephemeral: true,
      })

    const resOutput = response.text
    const resInputCode = response.raw.src
    const resOutputCode = inputTo.toLowerCase()

    const authorFetch = await interaction.user.fetch()
    const authorColor = authorFetch.accentColor
    const authorUsername = interaction.user.username
    const authorAvatar = interaction.user.displayAvatarURL()
    const translateEmbed = new EmbedBuilder()
      .setColor(authorColor)
      .setTimestamp()
      .setDescription('```' + resOutput + '```')
      .setAuthor({
        iconURL: authorAvatar,
        name:
          authorUsername +
          ' ' +
          interaction.client.i18n.t('commands.translate.says'),
      })
      .setFooter({
        text: '[' + resInputCode + '] -> [' + resOutputCode + ']',
      })

    await interaction.reply({ embeds: [translateEmbed], ephemeral: true })
  },
}
