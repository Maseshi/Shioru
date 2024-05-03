const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
  ],
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for the song or playlist you want.')
    .setDescriptionLocalizations({
      th: 'ค้นหาเพลงหรือเพลย์ลิสต์ที่คุณต้องการ',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription(
          'The name of the song or link of the song you want to search.'
        )
        .setDescriptionLocalizations({
          th: 'ชื่อเพลงหรือลิงค์ของเพลงที่คุณต้องการค้นหา',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('platform')
        .setDescription('What platform would you like to use to find music?')
        .setDescriptionLocalizations({
          th: 'คุณต้องการใช้แพลตฟอร์มใดเพื่อค้นหาเพลง?',
        })
        .setRequired(false)
        .addChoices(
          { name: 'YouTube', value: 'youtube' },
          { name: 'SoundCloud', value: 'soundcloud' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('The type of list you want to search for.')
        .setDescriptionLocalizations({
          th: 'ประเภทของรายการที่คุณต้องการค้นหา?',
        })
        .setRequired(false)
        .addChoices(
          { name: 'Track / Video', value: 'track' },
          { name: 'Playlist', value: 'playlist' }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply()

    const inputSong = interaction.options.getString('song')
    const inputPlatform = interaction.options.getString('platform') ?? ''
    const inputType = interaction.options.getString('type') ?? ''

    const limit = 10
    const djs = interaction.client.configs.djs
    const queue = interaction.client.player.getQueue(interaction)
    const voiceChannel = interaction.member.voice.channel
    const meChannel = interaction.guild.members.me.voice.channel

    const filter = (content) => {
      const index = []
      if (!content.content) return
      if (content.author.id !== interaction.user.id) return
      for (let i = 0; i < limit; i++) index.push((i + 1).toString())
      return index.includes(content.content) || !index.includes(content.content)
    }
    const searcher = async (platform, results) => {
      let index = 0
      const data = results
        .map((song) => {
          const name = song.name
          const uploaderName = song.uploader
            ? song.uploader.name
              ? ' : **' + song.uploader.name + '**'
              : ''
            : ''
          const formattedDuration = song.formattedDuration
            ? '`' + song.formattedDuration + '`'
            : ''
          return (
            '**' +
            ++index +
            '**' +
            '. ' +
            name +
            ' ' +
            formattedDuration +
            uploaderName
          )
        })
        .join('\n')

      const authorUsername = interaction.user.username
      const authorAvatar = interaction.user.displayAvatarURL()
      const searchEmbed = new EmbedBuilder()
        .setTitle(
          interaction.client.i18n
            .t('commands.search.searching')
            .replace(
              '%s',
              results[0].type === 'video' || results[0].type === 'track'
                ? interaction.client.i18n.t('commands.search.song_type')
                : interaction.client.i18n.t('commands.search.playlist_type')
            )
        )
        .setDescription(
          interaction.client.i18n
            .t('commands.search.timer_choose')
            .replace(
              '%s',
              results[0].type === 'video' || results[0].type === 'track'
                ? interaction.client.i18n.t('commands.search.song_type')
                : interaction.client.i18n.t('commands.search.playlist_type')
            )
        )
        .setColor(platform === 'youtube' ? 13632027 : 16296490)
        .setTimestamp()
        .setAuthor({
          name: platform === 'youtube' ? 'YouTube' : 'SoundCloud',
          url:
            platform === 'youtube'
              ? 'https://www.youtube.com/'
              : 'https://soundcloud.com/',
          iconURL:
            platform === 'youtube'
              ? 'https://www.youtube.com/s/desktop/6007d895/img/favicon_144x144.png'
              : 'https://a-v2.sndcdn.com/assets/images/sc-icons/ios-a62dfc8fe7.png',
        })
        .setFooter({ text: authorUsername, iconURL: authorAvatar })
        .addFields([
          {
            name: interaction.client.i18n
              .t('commands.search.title_results')
              .replace(
                '%s',
                results[0].type === 'video' || results[0].type === 'track'
                  ? interaction.client.i18n.t('commands.search.song_type')
                  : interaction.client.i18n.t('commands.search.playlist_type')
              ),
            value: data,
          },
        ])

      await interaction.editReply({
        embeds: [searchEmbed],
      })

      let collection

      try {
        collection = await interaction.channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ['time'],
        })
      } catch (error) {
        await interaction.editReply({
          content: interaction.client.i18n.t(
            'commands.search.search_cancelled'
          ),
          embeds: [],
        })
      }

      if (!collection) return

      const returnMessage = collection.first()
      const contentNumber = parseInt(returnMessage.content)
      const contentIndex = parseInt(returnMessage.content) - 1

      if (
        !contentNumber ||
        (!contentNumber && contentNumber < index) ||
        contentNumber > index
      )
        return await interaction.editReply({
          content: interaction.client.i18n.t('commands.search.invalid_number'),
          embeds: [],
        })

      await interaction.editReply({
        content: interaction.client.i18n.t('commands.search.get_list_of_songs'),
        embeds: [],
      })
      try {
        await interaction.client.player.play(
          voiceChannel,
          results[contentIndex],
          {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction,
          }
        )
        await interaction.deleteReply()
      } catch (error) {
        if (error.message.includes('seconds'))
          return await interaction.reply(
            interaction.client.i18n.t('commands.search.can_not_connect')
          )
        if (error.message.includes('non-NSFW'))
          return await interaction.reply(
            interaction.client.i18n.t(
              'commands.search.can_not_play_in_non_nsfw'
            )
          )
        if (!queue && meChannel) {
          const connection = interaction.client.player.voices.get(meChannel)

          connection.leave()
        }

        catchError(
          interaction.client,
          interaction,
          module.exports.data.name,
          error
        )
      }
    }

    if (queue && djs.enable) {
      if (
        interaction.user.id !== queue.songs[0].user.id &&
        queue.autoplay === false
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.search.currently_playing')
        )
      if (
        djs.users.includes(interaction.user.id) &&
        djs.roles.includes(
          interaction.member.roles.cache.map((role) => role.id)
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.search.not_a_dj')
        )
    }
    if (!voiceChannel)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.search.user_not_in_channel')
      )
    if (inputPlatform) {
      switch (inputPlatform) {
        case 'youtube':
          if (inputType) {
            try {
              const results = await interaction.client.player.search(
                inputSong,
                {
                  limit: limit,
                  type: inputType === 'track' ? 'video' : inputType,
                  safeSearch: true,
                }
              )

              searcher(inputPlatform, results)
            } catch {
              await interaction.editReply(
                interaction.client.i18n.t('commands.search.no_results')
              )
            }
          } else {
            try {
              const results = await interaction.client.player.search(
                inputSong,
                {
                  limit: limit,
                  safeSearch: true,
                }
              )

              searcher(inputPlatform, results)
            } catch {
              await interaction.editReply(
                interaction.client.i18n.t('commands.search.no_results')
              )
            }
          }
          break
        case 'soundcloud':
          if (inputType) {
            try {
              const results = await SoundCloudPlugin.search(
                inputSong,
                inputType
              )

              searcher(inputPlatform, results)
            } catch {
              await interaction.editReply(
                interaction.client.i18n.t('commands.search.no_results')
              )
            }
          } else {
            try {
              const results = await SoundCloudPlugin.search(inputSong)

              searcher(inputPlatform, results)
            } catch {
              await interaction.editReply(
                interaction.client.i18n.t('commands.search.no_results')
              )
            }
          }
          break
      }
    } else {
      if (inputType) {
        try {
          const results = await interaction.client.player.search(inputSong, {
            limit: limit,
            type: inputType === 'track' ? 'video' : inputType,
            safeSearch: true,
          })

          searcher('youtube', results)
        } catch {
          await interaction.editReply(
            interaction.client.i18n.t('commands.search.no_results')
          )
        }
      } else {
        try {
          const results = await interaction.client.player.search(inputSong, {
            limit: limit,
            safeSearch: true,
          })

          searcher('youtube', results)
        } catch {
          await interaction.editReply(
            interaction.client.i18n.t('commands.search.no_results')
          )
        }
      }
    }
  },
}
