const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageWebhooks,
  ],
  data: new SlashCommandBuilder()
    .setName('impersonate')
    .setDescription('Summons a fake user to reply.')
    .setDescriptionLocalizations({
      th: 'เสกผู้ใช้ปลอมขึ้นมาตอบกลับ',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Users who want to imitate.')
        .setDescriptionLocalizations({
          th: 'ผู้ใช้ที่ต้องการจะเลียนแบบ',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message you want to emulate.')
        .setDescriptionLocalizations({
          th: 'ข้อความที่ต้องการจะเลียนแบบ!',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })

    const inputUser = interaction.options.getUser('user')
    const inputMessage = interaction.options.getString('message')

    const member = await interaction.guild.members.fetch(inputUser.id)

    if (!member)
      return await interaction.reply(
        interaction.client.i18n.t('commands.impersonate.member_not_found')
      )

    const impersonateWebhook = await interaction.channel.createWebhook({
      name: inputUser.username,
      avatar: inputUser.displayAvatarURL({ dynamic: true }),
    })

    await impersonateWebhook.send(inputMessage)
    await impersonateWebhook.delete()
    await interaction.editReply(
      interaction.client.i18n
        .t('commands.impersonate.success')
        .replace('%s', inputUser.id)
    )
  },
}
