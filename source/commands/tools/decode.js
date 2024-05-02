const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('decode')
    .setDescription('Decrypt your messages.')
    .setDescriptionLocalizations({
      th: 'ถอดรหัสข้อความของคุณ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Message to be decrypted.')
        .setDescriptionLocalizations({
          th: 'ข้อความที่ต้องการจะถอดรหัส',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputText = interaction.options.getString('text')

    const clientAvatar = interaction.client.user.displayAvatarURL()
    const clientUsername = interaction.client.user.username
    const decodeEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({ iconURL: clientAvatar, name: clientUsername })
      .setTitle(interaction.client.i18n.t('commands.decode.decode_message'))
      .setDescription(
        interaction.client.i18n.t('commands.decode.decode_success')
      )
      .setFields(
        {
          name: interaction.client.i18n.t('commands.decode.before'),
          value: '```' + inputText + '```',
        },
        {
          name: interaction.client.i18n.t('commands.decode.after'),
          value: '```' + Buffer.from(inputText, 'base64').toString() + '```',
        }
      )
      .setTimestamp()

    await interaction.reply({ embeds: [decodeEmbed], ephemeral: true })
  },
}
