const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for this bot on Top.gg.')
    .setDescriptionLocalizations({
      th: 'โหวตคะแนนให้บอทนี้บน top.gg',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    await interaction.deferReply()

    const clientAvatar = interaction.client.user.avatarURL()
    const clientUsername = interaction.client.user.username
    const clientUserID = interaction.client.user.id

    const topName = 'top.gg'
    const topColor = '#FF3366'
    const topURL = 'https://top.gg'
    const topFavicon = `${topURL}/favicon.png`
    const topBotLink = `${topURL}/bot/${clientUserID}`
    const response = await fetch(`${topURL}/api/bots/${clientUserID}`, {
      headers: {
        Authorization: interaction.client.configs.top_gg_token,
      },
    })

    if (response.status !== 200)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.vote.not_found')
      )

    const data = await response.json()
    const date = new Date(data.date)
    const invite = data.invite
    const point = data.points
    const shortDescription = data.shortdesc
    const tags = data.tags.join(', ')

    const voteRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(invite)
        .setLabel(interaction.client.i18n.t('commands.vote.invite'))
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(`${topBotLink}/vote`)
        .setLabel(interaction.client.i18n.t('commands.vote.vote'))
        .setStyle(ButtonStyle.Link)
    )
    const voteEmbed = new EmbedBuilder()
      .setTitle(clientUsername)
      .setURL(topBotLink)
      .setDescription(`\`\`\`${shortDescription}\`\`\``)
      .setFields(
        {
          name: interaction.client.i18n.t('commands.vote.votes'),
          value: point.toString(),
          inline: false,
        },
        {
          name: interaction.client.i18n.t('commands.vote.tags'),
          value: tags,
          inline: false,
        }
      )
      .setThumbnail(clientAvatar)
      .setColor(topColor)
      .setTimestamp(date)
      .setFooter({ text: interaction.client.i18n.t('commands.vote.added') })
      .setAuthor({ name: topName, iconURL: topFavicon, url: topURL })

    await interaction.editReply({
      embeds: [voteEmbed],
      components: [voteRow],
    })
  },
}
