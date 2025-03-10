const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove song from the queue')
    .setDescriptionLocalizations({ th: 'ลบเพลงออกจากคิว' })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addIntegerOption((option) =>
      option
        .setName('number')
        .setDescription('The number of songs to be deleted.')
        .setDescriptionLocalizations({ th: 'หมายเลขของเพลงที่ต้องการจะลบ' })
        .setRequired(true)
        .setMinValue(1)
    ),
  async execute(interaction) {
    const inputAmount = interaction.options.getInteger('number')

    const djs = interaction.client.configs.djs
    const queue = interaction.client.player.getQueue(interaction)

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t('commands.remove.no_queue')
      )
    if (djs.enable) {
      if (
        interaction.user.id !== queue.songs[0].user.id &&
        queue.autoplay === false
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.remove.not_owner')
        )
      if (
        djs.users.includes(interaction.user.id) &&
        djs.roles.includes(
          interaction.member.roles.cache.map((role) => role.id)
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.remove.not_a_dj')
        )
    }
    if (inputAmount >= queue.songs.length)
      return await interaction.reply(
        interaction.client.i18n.t('commands.remove.too_much')
      )

    const song = queue.songs.splice(inputAmount, 1)
    await interaction.reply(
      interaction.client.i18n
        .t('commands.remove.removed')
        .replace('%s', song[0].name)
    )
  },
}
