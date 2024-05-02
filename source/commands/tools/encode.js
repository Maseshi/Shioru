const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('encode')
    .setDescription('Encrypt your messages.')
    .setDescriptionLocalizations({
      th: 'เข้ารหัสข้อความของคุณ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Message to be encrypted.')
        .setDescriptionLocalizations({
          th: 'ข้อความที่ต้องการจะเข้ารหัส',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputText = interaction.options.getString('text')

    const clientAvatar = interaction.client.user.displayAvatarURL()
    const clientUsername = interaction.client.user.username
    const encodeEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({ iconURL: clientAvatar, name: clientUsername })
      .setTitle(interaction.client.i18n.t('commands.encode.encode_message'))
      .setDescription(
        interaction.client.i18n.t('commands.encode.encode_success')
      )
      .setFields(
        {
          name: interaction.client.i18n.t('commands.encode.before'),
          value: '```' + inputText + '```',
        },
        {
          name: interaction.client.i18n.t('commands.encode.after'),
          value: '```' + Buffer.from(inputText).toString('base64') + '```',
        }
      )
      .setTimestamp()

    await interaction.reply({ embeds: [encodeEmbed], ephemeral: true })
  },
}
