const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.KickMembers,
  ],
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick members from the server.')
    .setDescriptionLocalizations({
      th: 'เตะสมาชิกจากออกเซิร์ฟเวอร์',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('Members who want to kick out of the server.')
        .setDescriptionLocalizations({
          th: 'สมาชิกที่ต้องการเตะออกจากเซิร์ฟเวอร์',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription(
          'The reason for kicking the said member from the server.'
        )
        .setDescriptionLocalizations({
          th: 'เหตุผลในการเตะสมาชิกดังกล่าวออกจากเซิร์ฟเวอร์',
        })
        .setRequired(false)
    ),
  async execute(interaction) {
    const inputMember = interaction.options.getMember('member')
    const inputReason =
      interaction.options.getString('reason') ??
      interaction.client.i18n.t('commands.kick.no_reason')

    const member = await interaction.guild.members.fetch(inputMember.id)

    if (!member)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.kick.can_not_find_user')
      )

    const memberPosition = inputMember.roles.highest.position
    const authorPosition = interaction.member.roles.highest.position

    if (authorPosition < memberPosition)
      return await interaction.reply(
        interaction.client.i18n.t('commands.kick.members_have_a_higher_role')
      )
    if (!inputMember.kickable)
      return await interaction.reply(
        interaction.client.i18n.t(
          'commands.kick.members_have_a_higher_role_than_me'
        )
      )

    const kicked = await inputMember.kick({ reason: inputReason })
    const authorUsername = interaction.user.username
    const memberAvatar = kicked.user.avatarURL()
    const memberUsername = kicked.user.username

    const kickEmbed = new EmbedBuilder()
      .setTitle(
        interaction.client.i18n
          .t('commands.kick.kicked_out')
          .replace('%s', memberUsername)
      )
      .setDescription(
        interaction.client.i18n
          .t('commands.kick.reason_for_kick')
          .replace('%s1', authorUsername)
          .replace('%s2', inputReason)
      )
      .setColor('Orange')
      .setTimestamp()
      .setThumbnail(memberAvatar)

    await interaction.reply({ embeds: [kickEmbed] })
  },
}
