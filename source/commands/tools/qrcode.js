const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('qrcode')
    .setDescription('Generate your QR code.')
    .setDescriptionLocalizations({
      th: 'สร้างคิวอาร์โค้ดของคุณ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Message to be encrypted.')
        .setDescriptionLocalizations({
          th: 'ข้อความหรือลิงค์ที่ต้องการจะสร้างคิวอาร์โค้ด',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputText = interaction.options.getString('text')

    const apiURL = 'https://api.qrserver.com/v1'
    const createQRCode = '/create-qr-code/?size=1024x1024&data='
    const data =
      apiURL + createQRCode + inputText.replace(new RegExp(' ', 'g'), '%20')

    const qrcodeEmbed = new EmbedBuilder()
      .setColor('White')
      .setTitle(interaction.client.i18n.t('commands.qrcode.qrcode_title'))
      .setDescription(
        interaction.client.i18n.t('commands.qrcode.qrcode_success')
      )
      .setImage(data)
      .setTimestamp()

    await interaction.reply({ embeds: [qrcodeEmbed] })
  },
}
