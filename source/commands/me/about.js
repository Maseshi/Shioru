const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('See information about bots.')
    .setDescriptionLocalizations({
      th: 'ดูข้อมูลเกี่ยวกับบอท',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const clientAvatar = interaction.client.user.avatarURL()
    const clientUsername = interaction.client.user.username
    const contentUpdate = interaction.client.configs.update
    const aboutEmbed = new EmbedBuilder()
      .setTitle(interaction.client.i18n.t('commands.about.my_profile'))
      .setDescription(
        interaction.client.i18n
          .t('commands.about.my_profile_detail')
          .replace('%s', clientUsername)
      )
      .setColor(Colors.Blue)
      .setTimestamp(new Date(contentUpdate))
      .setAuthor({
        name: clientUsername,
        iconURL: clientAvatar,
        url: 'https://shiorus.web.app/',
      })
      .setFooter({
        text: interaction.client.i18n.t('commands.about.update_on'),
      })

    await interaction.reply({ embeds: [aboutEmbed] })
  },
}
