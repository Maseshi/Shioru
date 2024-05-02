const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  resolveColor,
} = require('discord.js')
const { get } = require('axios').default

module.exports = {
  category: 'information',
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],
  usage: 'anime <title(String)>',
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Search for anime or manga available on Kitsu.')
    .setDescriptionLocalizations({
      th: 'ค้นหาอะนิเมะหรือมังงะที่มีอยู่ใน Kitsu',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title of the anime or manga.')
        .setDescriptionLocalizations({
          th: 'ชื่อเรื่องของอนิเมะหรือมังงะ',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputTitle = interaction.options.getString('title')

    const titles = (data) => {
      const numTitle = []

      for (let i = 0; i < data.length; i++) {
        const japanTitle = data[i].attributes.titles.en_jp
          ? data[i].attributes.titles.en_jp
          : ''
        const englishTitle = data[i].attributes.titles.en
          ? ' / ' + data[i].attributes.titles.en
          : ''
        const title = japanTitle + englishTitle

        numTitle.push('\n' + (i + 1) + '. ' + title)
      }

      return numTitle.join(' ')
    }
    const filter = (content) => {
      if (!content.content) return
      if (content.author.id !== interaction.user.id) return
      return ['1', '2', '3', '4', '5'].includes(content.content)
    }

    try {
      const baseURL = 'https://kitsu.io/api/edge'
      const anime = '/anime?page[limit]=5&filter[text]=' + inputTitle
      const manga = '/manga?page[limit]=5&filter[text]=' + inputTitle
      var response = await get(baseURL + (anime || manga), {
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      })
    } catch (error) {
      return await interaction.reply(
        interaction.client.i18n.t('commands.anime.data_not_found')
      )
    }

    const clientAvatarURL = interaction.client.user.avatarURL()
    const infoEmbed = new EmbedBuilder()
      .setTitle('```' + inputTitle + '```')
      .setDescription(
        interaction.client.i18n.t('commands.anime.similar_stories')
      )
      .setColor(resolveColor(16083235))
      .setFooter({
        text: interaction.client.i18n.t('commands.anime.auto_cancel'),
        iconURL: clientAvatarURL,
      })
      .setAuthor({
        name: 'Kitsu',
        url: 'https://kitsu.io/',
        iconURL:
          'https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png',
      })
      .addFields([
        {
          name: interaction.client.i18n.t('commands.anime.choose_now'),
          value: titles(response.data.data),
        },
      ])

    await interaction.reply({ embeds: [infoEmbed] })

    const collection = await interaction.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ['time'],
    })
    const returnMessage = collection.first()
    const index = parseInt(returnMessage.content) - 1

    const attributes = response.data.data[index].attributes
    const trimmedSynopsis =
      attributes.synopsis.length >= 1015
        ? attributes.synopsis.substring(0, 1015) + '...'
        : attributes.synopsis

    infoEmbed
      .setColor(12601856)
      .setFooter({
        text: interaction.client.i18n.t('commands.anime.short_information'),
        iconURL: clientAvatarURL,
      })
      .setFields([
        {
          name: interaction.client.i18n.t('commands.anime.japan_name'),
          value:
            attributes.titles.en_jp ||
            interaction.client.i18n.t('commands.anime.undefined'),
        },
        {
          name: interaction.client.i18n.t('commands.anime.english_name'),
          value:
            attributes.titles.en ||
            interaction.client.i18n.t('commands.anime.undefined'),
        },
        {
          name: interaction.client.i18n.t('commands.anime.start_date'),
          value: attributes.startDate,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.anime.end_date'),
          value:
            attributes.endDate ||
            interaction.client.i18n.t('commands.anime.in_progress'),
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.anime.popularity_rank'),
          value: attributes.popularityRank.toString(),
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.anime.link'),
          value:
            '<https://kitsu.io/' +
            attributes.type +
            '/' +
            response.data.data[index].id +
            '>',
        },
        {
          name: interaction.client.i18n.t('commands.anime.synopsis'),
          value: '```' + trimmedSynopsis + '```',
        },
      ])
    await interaction.editReply({ embeds: [infoEmbed] })
  },
}
