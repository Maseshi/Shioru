const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Details of the current song and queue.')
    .setDescriptionLocalizations({
      th: 'รายละเอียดของเพลงและคิวในปัจจุบัน',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('detail')
        .setDescription('See information for the currently playing song')
        .setDescriptionLocalizations({
          th: 'ดูข้อมูลสำหรับเพลงที่กำลังเล่นอยู่',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playing')
        .setDescription('Check the music that is currently playing.')
        .setDescriptionLocalizations({
          th: 'ตรวจสอบเพลงที่กำลังเล่นอยู่',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('status')
        .setDescription('Check the status of the current song queue.')
        .setDescriptionLocalizations({
          th: 'ตรวจสอบสถานะคิวเพลงปัจจุบัน',
        })
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()

    const queue = interaction.client.player.getQueue(interaction)

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t('commands.music.no_queue')
      )

    const queueName = queue.songs[0].name
    const queueTimestamp = queue.songs[0].formattedDuration
    const queueId = queue.songs[0].id
    const queueURL = queue.songs[0].url
    const queueStreamURL = queue.songs[0].streamURL
    const queueUploaderName = queue.songs[0].uploader.name
    const queueUploaderURL = queue.songs[0].uploader.url
    const queueThumbnail = queue.songs[0].thumbnail
    const queuePaused = queue.paused
    const queueVolume = queue.volume
    const queueFilter = queue.filters
    const queueDuration = queue.songs[0].duration
    const queueDurationCurrent = queue.currentTime
    const queueRepeat = queue.repeatMode
    const queueAutoplay = queue.autoplay
    const queueCreatedTimestamp = queue.createdTimestamp
    const queueAuthorUid = queue.songs[0].user.id
    const queueAuthorUsername = queue.songs[0].user.username
    const queueAuthorAvatar = queue.songs[0].user.avatar
    const queueAvatarURL = `https://cdn.discordapp.com/avatars/${queueAuthorUid}/${queueAuthorAvatar}.webp`

    const musicInfoEmbed = new EmbedBuilder()
      .setTitle(interaction.client.i18n.t('commands.music.detail'))
      .setImage(queueThumbnail)
      .setColor(Colors.Blue)
      .setTimestamp()
      .addFields([
        {
          name: interaction.client.i18n.t('commands.music.music_name'),
          value: queueName,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.uploader'),
          value: '[' + queueUploaderName + '](' + queueUploaderURL + ')',
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.duration'),
          value: queueTimestamp,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.id'),
          value: queueId,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.link'),
          value: queueURL,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.download_link'),
          value: '[Google Video](' + queueStreamURL + ')',
          inline: true,
        },
      ])
    const nowPlayingEmbed = new EmbedBuilder()
      .setTitle(queueName)
      .setURL(queueURL)
      .setThumbnail(queueThumbnail)
      .setColor(Colors.Blue)
      .setTimestamp(queueCreatedTimestamp)
      .setFooter({
        text: interaction.client.i18n
          .t('commands.music.owner_this_queue')
          .replace('%s', queueAuthorUsername),
        iconURL: queueAvatarURL,
      })
    const queueStatusEmbed = new EmbedBuilder()
      .setTitle(interaction.client.i18n.t('commands.music.queue_status'))
      .setColor(Colors.Blue)
      .setTimestamp(queueCreatedTimestamp)
      .setFooter({
        text: interaction.client.i18n
          .t('commands.music.owner_this_queue')
          .replace('%s', queueAuthorUsername),
        iconURL: queueAvatarURL,
      })
      .addFields([
        {
          name: interaction.client.i18n.t('commands.music.now'),
          value:
            '```' +
            (queuePaused
              ? interaction.client.i18n.t('commands.music.paused')
              : interaction.client.i18n.t('commands.music.playing')) +
            '```',
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.volume'),
          value: '```' + queueVolume + '```',
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.filter'),
          value:
            '```' +
            (queueFilter.names.length > 0
              ? queue.filters.names.join(', ')
              : '-:-') +
            '```',
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.repeat'),
          value:
            '```' +
            (queueRepeat === 0
              ? interaction.client.i18n.t('commands.music.repeat_off')
              : queueRepeat === 1
                ? interaction.client.i18n.t('commands.music.repeat_this_song')
                : interaction.client.i18n.t(
                    'commands.music.repeat_this_queue'
                  )) +
            '```',
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.autoplay'),
          value:
            '```' + queueAutoplay
              ? interaction.client.i18n.t('commands.music.on')
              : interaction.client.i18n.t('commands.music.off') + '```',
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.music.duration'),
          value: '```' + queueDurationCurrent + ' / ' + queueDuration + '```',
          inline: true,
        },
      ])

    switch (subcommand) {
      case 'detail':
        await interaction.reply({ embeds: [musicInfoEmbed] })
        break
      case 'playing':
        await interaction.reply({ embeds: [nowPlayingEmbed] })
        break
      case 'status':
        await interaction.reply({ embeds: [queueStatusEmbed] })
        break
    }
  },
}
