const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('Fake messages that say you will kill something.')
    .setDescriptionLocalizations({
      th: 'ข้อความปลอมที่บอกว่าคุณจะฆ่าอะไรบางอย่าง',
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of what you are about to kill.')
        .setDescriptionLocalizations({ th: 'ชื่อของสิ่งที่คุณกำลังจะฆ่า' })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputName = interaction.options.getString('name')

    const authorUsername = interaction.user.username
    const clientUsername = interaction.client.user.username
    const killEmbed = new EmbedBuilder()
      .setDescription(
        interaction.client.i18n
          .t('commands.kill.killed')
          .replace('%s1', authorUsername)
          .replace('%s2', inputName)
      )
      .setColor(Colors.DarkRed)

    if (inputName === clientUsername)
      return await interaction.reply(
        interaction.client.i18n.t('commands.kill.do_not_kill_me')
      )

    await interaction.reply({ embeds: [killEmbed] })
  },
}
