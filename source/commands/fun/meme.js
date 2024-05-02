const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  Colors,
  resolveColor,
} = require('discord.js')
const { randomInt } = require('../../utils/miscUtils')
const { get } = require('axios').default

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Randomly select the meme you want.')
    .setDescriptionLocalizations({
      th: 'สุ่มเลือกมีมที่คุณต้องการ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('Preferred category of meme')
        .setDescriptionLocalizations({
          th: 'หมวดหมู่ของมีมที่ต้องการ',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputCategory = interaction.options.getString('category') ?? ''

    const randomEmbed = async (choice) => {
      const category = ['meme', 'Memes_Of_The_Dank', 'memes', 'dankmemes']
      const random = choice ? choice : category[randomInt(category.length)]

      try {
        const response = await get(
          'https://www.reddit.com/r/' + random + '/random/.json'
        )

        if (!Array.isArray(response.data) || response.data.length === 0) {
          return new EmbedBuilder()
            .setColor('Red')
            .setDescription(
              interaction.client.i18n
                .t('commands.meme.meme_not_found')
                .replace('%s', choice)
            )
        }

        const permalink = response.data[0].data.children[0].data.permalink
        const memeUrl = `https://reddit.com${permalink}`
        const memeImage = response.data[0].data.children[0].data.url
        const memeTitle = response.data[0].data.children[0].data.title
        const memeUpvotes = response.data[0].data.children[0].data.ups
        const memeNumComments =
          response.data[0].data.children[0].data.num_comments
        const memeCreate = response.data[0].data.children[0].data.created

        return new EmbedBuilder()
          .setTitle(memeTitle)
          .setURL(memeUrl)
          .setImage(memeImage)
          .setColor(resolveColor('Random'))
          .setFooter({
            text: '👍 %s1 | 💬 %s2'
              .replace('%s1', memeUpvotes)
              .replace('%s2', memeNumComments),
          })
          .setTimestamp(new Date(memeCreate) * 1000)
      } catch (error) {
        return new EmbedBuilder()
          .setColor(Colors.Red)
          .setDescription(
            interaction.client.i18n.t('commands.meme.can_not_fetch')
          )
      }
    }

    const memeEmbed = await randomEmbed(inputCategory)
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('regenMemeButton')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🔁')
    )

    await interaction.reply({
      embeds: [memeEmbed],
      components: [buttonRow],
    })

    const collector = interaction.channel.createMessageCollector({
      filter: (reactor) => reactor.member.id !== interaction.member.id,
      time: 60,
      max: 3,
      dispose: true,
    })

    collector.on('collect', async (response) => {
      if (response.customId !== 'regenMemeButton') return
      await response.deferUpdate()

      const randomMemeEmbed = await randomEmbed(inputCategory)

      await interaction.editReply({
        embeds: [randomMemeEmbed],
        components: [buttonRow],
      })
    })
    collector.on('end', async () => {
      buttonRow.components.forEach((button) => button.setDisabled(true))

      await interaction.editReply({ components: [buttonRow] })
    })
  },
}
