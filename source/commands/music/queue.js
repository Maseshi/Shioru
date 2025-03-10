const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Check songs in the queue')
    .setDescriptionLocalizations({ th: 'ตรวจสอบเพลงในคิว' })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  async execute(interaction) {
    const queue = interaction.client.player.getQueue(interaction)

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t('commands.queue.no_queue')
      )

    const queueList = queue.songs
      .map(
        (song, id) =>
          id + '. ' + song.name + ' - `' + song.formattedDuration + '`'
      )
      .slice(1, 10)
      .join('\n')
    const queuePreviousList = queue.previousSongs
      .map(
        (song, id) =>
          id + 1 + '. ' + song.name + ' - `' + song.formattedDuration + '`'
      )
      .slice(0, 10)
      .join('\n')
    const queueCreatedTimestamp = queue.createdTimestamp
    const queueAuthorUid = queue.songs[0].user.id
    const queueAuthorUsername = queue.songs[0].user.username
    const queueAuthorAvatar = queue.songs[0].user.avatar
    const avatarURL =
      'https://cdn.discordapp.com/avatars/' +
      queueAuthorUid +
      '/' +
      queueAuthorAvatar +
      '.webp'

    const musicCurrent = queue.songs[0].name
    const musicURL = queue.songs[0].url

    let durationLine
    const duration = queue.songs[0].duration
    const durationCurrent = queue.currentTime
    const durationPercentage = Math.round((durationCurrent / duration) * 100)
    if (durationPercentage >= 0 && durationPercentage <= 5)
      durationLine = '🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 5 && durationPercentage <= 10)
      durationLine = '▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 10 && durationPercentage <= 15)
      durationLine = '▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 15 && durationPercentage <= 20)
      durationLine = '▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 20 && durationPercentage <= 25)
      durationLine = '▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 25 && durationPercentage <= 30)
      durationLine = '▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 30 && durationPercentage <= 35)
      durationLine = '▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 35 && durationPercentage <= 40)
      durationLine = '▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 40 && durationPercentage <= 45)
      durationLine = '▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 45 && durationPercentage <= 50)
      durationLine = '▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 50 && durationPercentage <= 55)
      durationLine = '▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 55 && durationPercentage <= 60)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬'
    if (durationPercentage >= 60 && durationPercentage <= 65)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬'
    if (durationPercentage >= 65 && durationPercentage <= 70)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬'
    if (durationPercentage >= 70 && durationPercentage <= 75)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬'
    if (durationPercentage >= 75 && durationPercentage <= 80)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬'
    if (durationPercentage >= 80 && durationPercentage <= 85)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬'
    if (durationPercentage >= 85 && durationPercentage <= 90)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬'
    if (durationPercentage >= 90 && durationPercentage <= 95)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬'
    if (durationPercentage >= 95 && durationPercentage <= 100)
      durationLine = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘'

    const durationFormat = queue.songs[0].formattedDuration
    const durationCurrentFormat = queue.formattedCurrentTime
    const durationCount =
      durationCurrentFormat + ' / ' + durationFormat + ' - ' + duration

    const musicPaused = interaction.client.player.paused ? '▶' : '▐▐'
    const musicAction = ' ◄◄⠀' + musicPaused + '⠀►► '

    let musicControl
    const musicVolume = queue.volume
    if (musicVolume === 0) musicControl = '🔇 ○───'
    if (musicVolume >= 0 && musicVolume <= 30) musicControl = '🔈 ─○──'
    if (musicVolume >= 30 && musicVolume <= 70) musicControl = '🔉 ──○─'
    if (musicVolume >= 70 && musicVolume <= 100) musicControl = '🔊 ───○'

    const musicRepeat =
      queue.repeatMode === 0 ? '' : queue.repeatMode === 1 ? '🔁' : '🔂'

    const musicAutoplay = queue.autoplay
      ? '\n' + interaction.client.i18n.t('commands.queue.autoplay')
      : ''

    const musicFilter =
      queue.filters.names.length > 0
        ? '\n' +
          interaction.client.i18n
            .t('commands.queue.filter')
            .replace('%s', queue.filters.names.join(', '))
        : ''

    const musicDisplay =
      durationLine +
      '\n' +
      durationCount +
      ' ' +
      musicAction +
      ' ' +
      musicControl +
      ' ' +
      musicRepeat +
      musicAutoplay +
      musicFilter

    const queueEmbed = new EmbedBuilder()
      .setTitle(musicCurrent)
      .setURL(musicURL)
      .setDescription(
        queue.songs.length === 1
          ? musicDisplay
          : musicDisplay +
              '\n\n' +
              interaction.client.i18n.t('commands.queue.waiting_in_queue') +
              '\n' +
              queueList +
              (queue.previousSongs.length === 1
                ? '\n\n' +
                  interaction.client.i18n.t('commands.queue.previous_queue') +
                  '\n' +
                  queuePreviousList
                : '')
      )
      .setColor('Blue')
      .setTimestamp(queueCreatedTimestamp)
      .setFooter({
        text: interaction.client.i18n
          .t('commands.queue.owner_this_queue')
          .replace('%s', queueAuthorUsername),
        iconURL: avatarURL,
      })

    await interaction.reply({ embeds: [queueEmbed] })
  },
}
