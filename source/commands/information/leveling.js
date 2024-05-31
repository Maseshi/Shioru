const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js')
const { fetchLevel } = require('../../utils/databaseUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('leveling')
    .setDescription('See information about your level.')
    .setDescriptionLocalizations({
      th: 'ดูข้อมูลเกี่ยวกับเลเวลของคุณ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('The name of the member you wish to view the level.')
        .setDescriptionLocalizations({
          th: 'ชื่อของสมาชิกที่คุณต้องการดูระดับของเขา',
        })
        .setRequired(false)
    ),
  async execute(interaction) {
    const inputMember = interaction.options.getMember('member') ?? ''

    let author = interaction.user
    let authorAvatar = author.displayAvatarURL()
    let authorFetch = await author.fetch()
    let memberBot = false

    if (inputMember) {
      author = inputMember
      authorAvatar = author.avatarURL()
      authorFetch = await author.fetch()
      memberBot = author.bot
    }
    if (memberBot)
      return await interaction.reply(
        interaction.client.i18n.t('commands.leveling.bot_do_not_have_level')
      )

    const data = await fetchLevel(interaction.client, interaction, 'GET', {
      member: author,
    })
    const status = data.status

    if (status !== 'success')
      return await interaction.reply(
        interaction.client.i18n.t('commands.leveling.user_no_data')
      )

    const exp = data.exp
    const level = data.level
    const nextEXP = data.nextEXP

    const levelingEmbed = new EmbedBuilder()
      .setTitle(interaction.client.i18n.t('commands.leveling.your_experience'))
      .setColor(authorFetch.accentColor)
      .setThumbnail(authorAvatar)
      .setTimestamp()
      .addFields([
        {
          name: interaction.client.i18n.t('commands.leveling.level'),
          value: '```' + level + '```',
        },
        {
          name: interaction.client.i18n.t('commands.leveling.experience'),
          value: '```' + exp + '/' + nextEXP + '```',
        },
      ])

    await interaction.reply({ embeds: [levelingEmbed] })
  },
}
