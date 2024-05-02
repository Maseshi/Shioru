const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('tableflip')
    .setDescription('(\\\\°□°)\\\\  ┬─┬')
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const frames = [
      '(-°□°)-  ┬─┬',
      '(╯°□°)╯    ]',
      '(╯°□°)╯  ︵  ┻━┻',
      '(╯°□°)╯       [',
      '(╯°□°)╯           ┬─┬',
    ]

    await interaction.reply('(\\\\°□°)\\\\  ┬─┬')

    for (const frame of frames) {
      setTimeout(async () => {
        await interaction.editReply(frame)
      }, 1000)
    }
  },
}
