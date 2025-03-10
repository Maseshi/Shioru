const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.KickMembers,
  ],
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn the user to stop doing something.')
    .setDescriptionLocalizations({ th: 'เตือนผู้ใช้ให้หยุดกระทำบางอย่าง' })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('Members who want to be warned to stop doing something')
        .setDescriptionLocalizations({
          th: 'สมาชิกที่ต้องการเตือนให้หยุดกระทำบางอย่าง',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('warn')
        .setDescription('Reason for warning such members.')
        .setDescriptionLocalizations({ th: 'เหตุผลในการเตือนสมาชิกดังกล่าว' })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputMember = interaction.options.getMember('member')
    const inputWarn = interaction.options.getString('warn')

    const member = await interaction.guild.members.fetch(inputMember.id)

    if (!member)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.warn.can_not_find_user')
      )

    const memberPosition = inputMember.roles.highest.position
    const authorPosition = interaction.member.roles.highest.position

    if (authorPosition < memberPosition)
      return await interaction.reply(
        interaction.client.i18n.t('commands.warn.members_have_a_higher_role')
      )
    if (!inputMember.kickable)
      return await interaction.reply(
        interaction.client.i18n.t(
          'commands.warn.members_have_a_higher_role_than_me'
        )
      )

    const warned = await inputMember.kick({ reason: inputWarn })
    const authorUsername = interaction.user.username
    const memberAvatar = warned.user.avatarURL()
    const memberUsername = warned.user.username

    const memberEmbed = new EmbedBuilder()
      .setTitle(
        interaction.client.i18n.t('commands.warn.you_has_warned', {
          manager: authorUsername,
        })
      )
      .setDescription(
        interaction.client.i18n.t('commands.warn.you_has_warned', {
          reason: inputWarn,
        })
      )
      .setColor('Orange')
      .setTimestamp()
      .setThumbnail(memberAvatar)
    const warnEmbed = new EmbedBuilder()
      .setTitle(
        interaction.client.i18n.t('commands.warn.you_have_warned', {
          user: memberUsername,
        })
      )
      .setDescription(
        interaction.client.i18n.t('commands.warn.user_has_warned_by', {
          manager: authorUsername,
          reason: inputWarn,
        })
      )
      .setColor('Orange')
      .setTimestamp()
      .setThumbnail(memberAvatar)

    warned.send({ embeds: [memberEmbed] })
    await interaction.reply({ embeds: [warnEmbed] })
  },
}
