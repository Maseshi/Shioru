const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const { get } = require('axios').default

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
    const clientAvatar = interaction.client.user.avatarURL()
    const clientUsername = interaction.client.user.username
    const clientTopGgID = interaction.client.configs.top_gg.id

    const topName = 'top.gg'
    const topColor = '#FF3366'
    const topURL = 'https://top.gg'
    const topFavicon = `${topURL}/favicon.png`
    const topBotLink = `${topURL}/bot/${clientTopGgID}`
    const topResponse = await get(`${topURL}/api/bots/${clientTopGgID}`, {
      headers: {
        Authorization: interaction.client.configs.top_gg.token,
      },
    })

    const date = new Date(topResponse.data.date)
    const invite = topResponse.data.invite
    const point = topResponse.data.points
    const shortDescription = topResponse.data.shortdesc
    const tags = topResponse.data.tags.join(', ')

    const voteRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(invite)
        .setLabel(interaction.client.i18n.t('commands.vote.invite'))
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(topBotLink + '/vote')
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

    await interaction.reply({
      embeds: [voteEmbed],
      components: [voteRow],
    })
  },
}
