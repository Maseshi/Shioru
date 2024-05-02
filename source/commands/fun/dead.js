const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('dead')
    .setDescription('Fake message that says you commit suicide.')
    .setDescriptionLocalizations({
      th: 'ข้อความปลอมที่บอกว่าคุณฆ่าตัวตาย',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const authorUsername = interaction.user.username
    const deadEmbed = new EmbedBuilder()
      .setDescription(
        interaction.client.i18n
          .t('commands.dead.suicide')
          .replace('%s', authorUsername)
      )
      .setColor('Default')

    await interaction.reply({ embeds: [deadEmbed] })
  },
}
