const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Displays the bots current uptime!')
    .setDescriptionLocalizations({
      th: 'แสดงเวลาการทำงานของฉันในตอนนี้',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const ms = interaction.client.uptime
    const sec = Math.floor((ms / 1000) % 60).toString()
    const min = Math.floor((ms / (1000 * 60)) % 60).toString()
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString()
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
    const duration =
      days.padStart(1, '0') +
      ' ' +
      interaction.client.i18n.t('commands.uptime.days') +
      ' ' +
      hrs.padStart(2, '0') +
      ' ' +
      interaction.client.i18n.t('commands.uptime.hours') +
      ' ' +
      min.padStart(2, '0') +
      ' ' +
      interaction.client.i18n.t('commands.uptime.minute') +
      ' ' +
      sec.padStart(2, '0') +
      ' ' +
      interaction.client.i18n.t('commands.uptime.second') +
      ' '

    const clientAvatar = interaction.client.user.displayAvatarURL()
    const clientUsername = interaction.client.user.username
    const uptimeEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({ iconURL: clientAvatar, name: clientUsername })
      .setTitle(interaction.client.i18n.t('commands.uptime.info_title'))
      .setDescription('```' + duration + '```')

    await interaction.reply({ embeds: [uptimeEmbed] })
  },
}
