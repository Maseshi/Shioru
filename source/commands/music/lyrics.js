const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
} = require('discord.js')
const { Client } = require('genius-lyrics')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics for the currently playing song')
    .setDescriptionLocalizations({
      th: 'รับเนื้อเพลงสำหรับเพลงที่กำลังเล่นอยู่',
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Search for lyrics by desired song name.')
        .setDescriptionLocalizations({
          th: 'ค้นหาเนื้อเพลงด้วยชื่อเพลงที่ต้องการ',
        })
    ),
  async execute(interaction) {
    const inputName = interaction.options.getString('name') ?? ''

    const queue = interaction.client.player.getQueue(interaction)

    if (!queue && !inputName)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.lyrics.no_queue')
      )

    const songName = inputName ? inputName : queue.songs[0].name
    const authorUsername = interaction.user.username
    const authorAvatar = interaction.user.displayAvatarURL()
    const lyricsEmbed = new EmbedBuilder()
      .setTitle(interaction.client.i18n.t('commands.lyrics.playing_lyrics'))
      .setColor(Colors.Blue)
      .setTimestamp()
      .setFooter({ text: authorUsername, iconURL: authorAvatar })

    try {
      await interaction.deferReply()

      const genius = new Client()
      const searches = await genius.songs.search(songName)
      const lyrics = await searches[0].lyrics()

      if (searches) {
        lyricsEmbed.setDescription(`\`\`\`${lyrics}\`\`\``)
      } else {
        lyricsEmbed.setDescription(
          `\`\`\`${interaction.client.i18n.t('commands.lyrics.can_not_find_lyrics').replace('%s', songName)}\`\`\``
        )
      }
    } catch (error) {
      lyricsEmbed.setDescription(
        `\`\`\`${interaction.client.i18n.t('commands.lyrics.can_not_find_lyrics').replace('%s', songName)}\`\`\``
      )
    }

    await interaction.editReply({ embeds: [lyricsEmbed] })
  },
}
