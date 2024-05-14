const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Get your user information')
    .setDescriptionLocalizations({
      th: 'รับข้อมูลผู้ใช้ของคุณ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('See the types of data currently available.')
        .setDescriptionLocalizations({
          th: 'ดูประเภทของข้อมูลที่พร้อมใช้งานในขณะนี้',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('get')
        .setDescription('Get the information of the user you want to explore.')
        .setDescriptionLocalizations({
          th: 'รับข้อมูลของผู้ใช้ที่ต้องการจะสำรวจ',
        })
        .addStringOption((option) =>
          option
            .setName('about')
            .setDescription('Information you want to know, such as avatarURL')
            .setDescriptionLocalizations({
              th: 'ข้อมูลที่คุณต้องการจะทราบ เช่น avatarURL',
            })
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Information of other members you wish to see.')
            .setDescriptionLocalizations({
              th: 'ข้อมูลของสมาชิกคนอื่น ๆ ที่คุณต้องการดู',
            })
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputAbout = interaction.options.getString('about') ?? ''
    const inputMember = interaction.options.getMember('member') ?? ''

    const user = inputMember ? inputMember.user : interaction.user
    const userProperties = {
      accentColor:
        user.accentColor?.toString() ||
        interaction.client.i18n.t('commands.user.none'),
      avatar: user.avatar || interaction.client.i18n.t('commands.user.unknown'),
      avatarURL:
        user.avatarURL() || interaction.client.i18n.t('commands.user.none'),
      avatarDecoration:
        user.avatarDecoration ||
        interaction.client.i18n.t('commands.user.unknown'),
      avatarDecorationURL:
        user.avatarDecorationURL() ||
        interaction.client.i18n.t('commands.user.none'),
      banner: user.banner || interaction.client.i18n.t('commands.user.unknown'),
      bannerURL:
        user.bannerURL() || interaction.client.i18n.t('commands.user.none'),
      bot:
        (user.bot
          ? interaction.client.i18n.t('commands.user.yes')
          : interaction.client.i18n.t('commands.user.no')) ||
        interaction.client.i18n.t('commands.user.unknown'),
      createAt:
        new Date(user.createAt).toLocaleString(interaction.locale) ||
        interaction.client.i18n.t('commands.user.unknown'),
      createdTimestamp:
        user.createdTimestamp?.toString() ||
        interaction.client.i18n.t('commands.user.unknown'),
      defaultAvatarURL:
        user.defaultAvatarURL ||
        interaction.client.i18n.t('commands.user.unknown'),
      discriminator:
        user.discriminator || interaction.client.i18n.t('commands.user.none'),
      displayAvatarURL:
        user.displayAvatarURL() ||
        interaction.client.i18n.t('commands.user.none'),
      displayName:
        user.displayName || interaction.client.i18n.t('commands.user.unknown'),
      flags:
        user.flags.toArray().join(', ') ||
        interaction.client.i18n.t('commands.user.none'),
      globalName:
        user.displayName || interaction.client.i18n.t('commands.user.unknown'),
      hexAccentColor:
        user.hexAccentColor || interaction.client.i18n.t('commands.user.none'),
      id: user.id || interaction.client.i18n.t('commands.user.unknown'),
      partial: user.partial
        ? interaction.client.i18n.t('commands.user.yes')
        : interaction.client.i18n.t('commands.user.no') ||
          interaction.client.i18n.t('commands.user.unknown'),
      system: user.system
        ? interaction.client.i18n.t('commands.user.yes')
        : interaction.client.i18n.t('commands.user.no') ||
          interaction.client.i18n.t('commands.user.unknown'),
      tag: user.tag || interaction.client.i18n.t('commands.user.none'),
      username:
        user.username || interaction.client.i18n.t('commands.user.unknown'),
    }
    const propertiesKeys = Object.keys(userProperties)
    const propertiesData = Object.fromEntries(
      Object.entries(userProperties).map(([key, value]) => [
        key.toLowerCase(),
        value,
      ])
    )
    const propertiesName =
      propertiesKeys[
        propertiesKeys.findIndex((key) =>
          key.toLowerCase().includes(inputAbout.toLowerCase())
        )
      ]
    const propertiesType = propertiesKeys.map((type) => type.toLowerCase())

    switch (subcommand) {
      case 'list': {
        await interaction.reply(
          interaction.client.i18n.t('commands.user.available_type_list', {
            list: propertiesKeys.join(', '),
          })
        )
        break
      }
      case 'get': {
        if (!propertiesType.includes(inputAbout.toLowerCase()))
          return interaction.reply(
            interaction.client.i18n.t('commands.user.invalid_type')
          )

        const clientUsername = interaction.client.user.username
        const clientAvatarURL = interaction.client.user.avatarURL()
        const userEmbed = new EmbedBuilder()
          .setTitle(interaction.client.i18n.t('commands.user.user_info'))
          .setDescription(
            interaction.client.i18n.t('commands.user.user_info_description')
          )
          .setColor(parseInt(userProperties.accentColor) || Colors.Aqua)
          .setTimestamp()
          .setFooter({
            text: interaction.client.i18n.t('commands.user.info_date'),
            iconURL: userProperties.avatarURL || '',
          })
          .setThumbnail(userProperties.avatarURL || '')
          .setAuthor({ name: clientUsername, iconURL: clientAvatarURL })

        userEmbed.addFields({
          name: propertiesName,
          value: propertiesData[inputAbout.toLowerCase()],
          inline: true,
        })

        await interaction.reply({ embeds: [userEmbed] })
        break
      }
    }
  },
}
