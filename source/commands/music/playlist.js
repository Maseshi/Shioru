const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js')
const { catchError } = require('../../utils/consoleUtils')
const { containsURL } = require('../../utils/miscUtils')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.Speak,
  ],
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Create or add a playlist of songs.')
    .setDescriptionLocalizations({
      th: 'สร้างหรือเพิ่มเพลย์ลิสต์ของเพลง',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('songs')
        .setDescription(
          'The links to the songs you want in the playlist are separated by "," for each item.'
        )
        .setDescriptionLocalizations({
          th: 'ลิงค์ของเพลงที่คุณต้องการในเพลย์ลิสต์คั่นด้วย "," สำหรับแต่ละรายการ',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Name of the playlist')
        .setDescriptionLocalizations({
          th: 'ชื่อของเพลย์ลิสต์',
        })
    )
    .addBooleanOption((option) =>
      option
        .setName('skip')
        .setDescription(
          'Immediately skip the currently playing song (if it exists) and play the added song.'
        )
        .setDescriptionLocalizations({
          th: 'ข้ามเพลงที่เล่นอยู่ทันที (หากมีอยู่) และเล่นเพลงที่เพิ่มมา',
        })
    )
    .addIntegerOption((option) =>
      option
        .setName('position')
        .setDescription(
          'The position of the playlist to be inserted or added, starting from zero.'
        )
        .setDescriptionLocalizations({
          th: 'ตำแหน่งของเพลย์ลิสต์ที่ต้องการแทรกหรือเพิ่มโดยเริ่มต้นนับจากศูนย์',
        })
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel that wants her to play music.')
        .setDescriptionLocalizations({
          th: 'ช่องที่ต้องการให้เธอเล่นเพลง',
        })
        .addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
    ),
  async execute(interaction) {
    const inputSongs = interaction.options.getString('songs')
    const inputName =
      interaction.options.getString('name') ??
      interaction.client.i18n.t('commands.playlist.playlist_of_user', {
        id: interaction.user.id,
      })
    const inputSkip = interaction.options.getBoolean('skip') ?? false
    const inputPosition = interaction.options.getInteger('position') ?? 0
    const inputChannel = interaction.options.getChannel('channel') ?? ''

    const djs = interaction.client.configs.djs
    const queue = interaction.client.player.getQueue(interaction)
    const voiceChannel = interaction.member.voice.channel
    const meChannel = interaction.guild.members.me.voice.channel
    const songs = inputSongs.split(/[ ,]+/)
    const filteredSongs = songs.filter((song) => containsURL(song))

    if (queue && djs.enable) {
      if (
        interaction.user.id !== queue.songs[0].user.id &&
        queue.autoplay === false
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.playlist.not_owner')
        )
      if (
        djs.users.includes(interaction.user.id) &&
        djs.roles.includes(
          interaction.member.roles.cache.map((role) => role.id)
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.playlist.not_a_dj')
        )
    }
    if (!queue && (inputSkip || inputPosition))
      return await interaction.reply(
        interaction.client.i18n.t('commands.playlist.no_queue')
      )
    if (!voiceChannel && !inputChannel)
      return await interaction.reply(
        interaction.client.i18n.t('commands.playlist.not_in_channel')
      )
    if (!filteredSongs.length)
      return await interaction.reply(
        interaction.client.i18n.t('commands.playlist.need_for_link')
      )

    try {
      await interaction.deferReply()

      const playlist = await interaction.client.player.createCustomPlaylist(
        filteredSongs,
        {
          member: interaction.member,
          properties: { name: inputName, source: 'custom' },
          parallel: true,
        }
      )

      await interaction.client.player.play(
        voiceChannel ?? inputChannel,
        playlist,
        {
          member: interaction.member,
          textChannel: interaction.channel,
          skip: inputSkip,
          position: inputPosition,
          interaction,
        }
      )
      await interaction.deleteReply()
    } catch (error) {
      if (error.message.includes('seconds'))
        return await interaction.reply(
          interaction.client.i18n.t('commands.playlist.can_not_connect')
        )
      if (error.message.includes('non-NSFW'))
        return await interaction.reply(
          interaction.client.i18n.t(
            'commands.playlist.can_not_play_in_non_nsfw'
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
  },
}
