const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  resolveColor,
} = require('discord.js')
const { get } = require('axios').default

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('nekos')
    .setDescription('Random anime pictures as you want.')
    .setDescriptionLocalizations({
      th: 'สุ่มรูปอนิเมะตามที่คุณต้องการ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('The desired type of anime image.')
        .setDescriptionLocalizations({
          th: 'ประเภทของรูปภาพอนิเมะที่ต้องการ',
        })
        .setRequired(true)
        .setChoices(
          { name: 'Tickle', value: 'tickle' },
          { name: 'Slap', value: 'slap' },
          { name: 'Poke', value: 'poke' },
          { name: 'Pat', value: 'pat' },
          { name: 'Neko', value: 'neko' },
          { name: 'Meow', value: 'meow' },
          { name: 'Lizard', value: 'lizard' },
          { name: 'Kiss', value: 'kiss' },
          { name: 'Hug', value: 'hug' },
          { name: 'Fox Girl', value: 'foxGirl' },
          { name: 'Feed', value: 'feed' },
          { name: 'Cuddle', value: 'cuddle' },
          { name: 'Neko GIF', value: 'nekoGif' },
          { name: 'Kemonomimi', value: 'kemonomimi' },
          { name: 'Holo', value: 'holo' },
          { name: 'Smug', value: 'smug' },
          { name: 'Baka', value: 'baka' },
          { name: 'Woof', value: 'woof' },
          { name: 'Wallpaper', value: 'wallpaper' },
          { name: 'Goose', value: 'goose' },
          { name: 'Gecg', value: 'gecg' },
          { name: 'Avatar', value: 'avatar' },
          { name: 'Waifu', value: 'waifu' }
        )
    ),
  async execute(interaction) {
    const inputType = interaction.options.getString('type')

    const api = 'https://nekos.life/api/v2'
    const endpoints = {
      tickle: '/img/tickle',
      slap: '/img/slap',
      poke: '/img/poke',
      pat: '/img/pat',
      neko: '/img/neko',
      meow: '/img/meow',
      lizard: '/img/lizard',
      kiss: '/img/kiss',
      hug: '/img/hug',
      foxGirl: '/img/fox_girl',
      feed: '/img/feed',
      cuddle: '/img/cuddle',
      nekoGif: '/img/ngif',
      kemonomimi: '/img/kemonomimi',
      holo: '/img/holo',
      smug: '/img/smug',
      baka: '/img/baka',
      woof: '/img/woof',
      wallpaper: '/img/wallpaper',
      goose: '/img/goose',
      gecg: '/img/gecg',
      avatar: '/img/avatar',
      waifu: '/img/waifu',
    }

    try {
      const response = await get(api + endpoints[inputType])

      const title = Object.keys(endpoints).find(
        (key) => endpoints[key] === endpoints[inputType]
      )
      const authorUsername = interaction.user.username
      const authorAvatar = interaction.user.displayAvatarURL()
      const nekosEmbed = new EmbedBuilder()
        .setColor(resolveColor('Random'))
        .setTitle(title.charAt(0).toUpperCase() + title.slice(1))
        .setImage(response.data.url)
        .setFooter({
          iconURL: authorAvatar,
          text: interaction.client.i18n
            .t('commands.nekos.request_by')
            .replace('%s', authorUsername),
        })
        .setTimestamp()

      await interaction.reply({ embeds: [nekosEmbed] })
    } catch (error) {
      await interaction.reply(
        interaction.client.i18n.t('commands.nekos.can_not_fetch_data')
      )
    }
  },
}
