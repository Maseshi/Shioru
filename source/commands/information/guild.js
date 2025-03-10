const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildMFALevel,
  GuildNSFWLevel,
  GuildPremiumTier,
  GuildVerificationLevel,
  Colors,
  InteractionContextType,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('guild')
    .setDescription('Get information about the guild.')
    .setDescriptionLocalizations({
      th: 'รับข้อมูลเกี่ยวกับกิลด์นี้',
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
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
        .setDescription('Get the information of the guild you want to know.')
        .setDescriptionLocalizations({
          th: 'รับข้อมูลของกิลด์ที่อยากรู้',
        })
        .addStringOption((option) =>
          option
            .setName('about')
            .setDescription(
              'Information you want to know, such as afkChannelId'
            )
            .setDescriptionLocalizations({
              th: 'ข้อมูลที่คุณต้องการจะทราบ เช่น afkChannelId',
            })
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputAbout = interaction.options.getString('about') ?? ''

    await interaction.deferReply()

    const guild = interaction.guild
    const guildProperties = {
      afkChannel: guild.afkChannel
        ? `<#${guild.afkChannel.id}>`
        : interaction.client.i18n.t('commands.guild.not_set'),
      afkChannelId:
        guild.afkChannelId || interaction.client.i18n.t('commands.guild.none'),
      afkTimeout:
        guild.afkTimeout?.toString() ||
        interaction.client.i18n.t('commands.guild.not_set'),
      applicationId:
        guild.applicationId || interaction.client.i18n.t('commands.guild.none'),
      approximateMemberCount:
        guild.approximateMemberCount?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      approximatePresenceCount:
        guild.approximatePresenceCount?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      autoModerationRules:
        String((await guild.autoModerationRules.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.not_set'),
      available:
        (guild.available
          ? interaction.client.i18n.t('commands.guild.ready')
          : interaction.client.i18n.t('commands.guild.not_ready')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      banner:
        guild.banner || interaction.client.i18n.t('commands.guild.unknown'),
      bannerURL:
        guild.bannerURL() || interaction.client.i18n.t('commands.guild.none'),
      bans:
        String((await guild.bans.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      channels:
        String((await guild.channels.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      commands:
        String((await guild.commands.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      createdAt:
        new Date(guild.createdAt).toLocaleString(interaction.locale) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      createdTimestamp:
        guild.createdTimestamp?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      defaultMessageNotifications:
        GuildDefaultMessageNotifications[guild.defaultMessageNotifications] ||
        interaction.client.i18n.t('commands.guild.unknown'),
      description:
        guild.description || interaction.client.i18n.t('commands.guild.none'),
      discoverySplash:
        guild.discoverySplash ||
        interaction.client.i18n.t('commands.guild.unknown'),
      discoverySplashURL:
        guild.discoverySplashURL() ||
        interaction.client.i18n.t('commands.guild.none'),
      emojis:
        String((await guild.emojis.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.none'),
      explicitContentFilter:
        GuildExplicitContentFilter[guild.explicitContentFilter] ||
        interaction.client.i18n.t('commands.guild.unknown'),
      features:
        guild.features.join(', ') ||
        interaction.client.i18n.t('commands.guild.none'),
      icon: guild.icon || interaction.client.i18n.t('commands.guild.unknown'),
      iconURL:
        guild.iconURL() || interaction.client.i18n.t('commands.guild.none'),
      id: guild.id || interaction.client.i18n.t('commands.guild.unknown'),
      invites:
        String((await guild.invites.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.none'),
      large:
        (guild.large
          ? interaction.client.i18n.t('commands.guild.yes')
          : interaction.client.i18n.t('commands.guild.no')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      maximumBitrate:
        guild.maximumBitrate?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      maximumMembers:
        guild.maximumMembers?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      maximumPresences:
        guild.maximumPresences?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      maxStageVideoChannelUsers:
        guild.maxStageVideoChannelUsers?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      maxVideoChannelUsers:
        guild.maxVideoChannelUsers?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      memberCount:
        guild.memberCount?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      mfaLevel:
        GuildMFALevel[guild.mfaLevel] ||
        interaction.client.i18n.t('commands.guild.unknown'),
      name: guild.name || interaction.client.i18n.t('commands.guild.unknown'),
      nameAcronym:
        guild.nameAcronym ||
        interaction.client.i18n.t('commands.guild.unknown'),
      nsfwLevel:
        GuildNSFWLevel[guild.nsfwLevel] ||
        interaction.client.i18n.t('commands.guild.unknown'),
      ownerId:
        guild.ownerId || interaction.client.i18n.t('commands.guild.unknown'),
      partnered:
        (guild.partnered
          ? interaction.client.i18n.t('commands.guild.yes')
          : interaction.client.i18n.t('commands.guild.no')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      preferredLocale:
        guild.preferredLocale ||
        interaction.client.i18n.t('commands.guild.unknown'),
      premiumProgressBarEnabled:
        guild.premiumProgressBarEnabled ||
        interaction.client.i18n.t('commands.guild.unknown'),
      premiumSubscriptionCount:
        guild.premiumSubscriptionCount?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      premiumTier:
        GuildPremiumTier[guild.premiumTier] ||
        interaction.client.i18n.t('commands.guild.unknown'),
      publicUpdatesChannel:
        (guild.publicUpdatesChannel
          ? `<#${guild.publicUpdatesChannel.id}>`
          : interaction.client.i18n.t('commands.guild.not_set')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      publicUpdatesChannelId:
        guild.publicUpdatesChannelId ||
        interaction.client.i18n.t('commands.guild.unknown'),
      roles:
        String((await guild.roles.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      rulesChannel:
        (guild.rulesChannel
          ? `<#${guild.rulesChannel.id}>`
          : interaction.client.i18n.t('commands.guild.not_set')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      rulesChannelId:
        guild.rulesChannelId ||
        interaction.client.i18n.t('commands.guild.unknown'),
      safetyAlertsChannel:
        (guild.safetyAlertsChannel
          ? `<#${guild.safetyAlertsChannel}>`
          : interaction.client.i18n.t('commands.guild.not_set')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      safetyAlertsChannelId:
        guild.safetyAlertsChannelId ||
        interaction.client.i18n.t('commands.guild.unknown'),
      scheduledEvents:
        String((await guild.scheduledEvents.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      shardId:
        guild.shardId?.toString() ||
        interaction.client.i18n.t('commands.guild.unknown'),
      splash:
        guild.splash || interaction.client.i18n.t('commands.guild.unknown'),
      splashURL:
        guild.splashURL() || interaction.client.i18n.t('commands.guild.none'),
      stickers:
        String((await guild.stickers.fetch()).size) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      systemChannel:
        (guild.systemChannel
          ? `<#${guild.systemChannel}>`
          : interaction.client.i18n.t('commands.guild.not_set')) ||
        interaction.client.i18n.t('commands.guild.none'),
      systemChannelFlags:
        guild.systemChannelFlags.toArray().join(', ') ||
        interaction.client.i18n.t('commands.guild.unknown'),
      systemChannelId:
        guild.systemChannelId ||
        interaction.client.i18n.t('commands.guild.unknown'),
      vanityURLCode:
        guild.vanityURLCode || interaction.client.i18n.t('commands.guild.none'),
      vanityURLUses:
        guild.vanityURLUses?.toString() ||
        interaction.client.i18n.t('commands.guild.none'),
      verificationLevel:
        GuildVerificationLevel[guild.verificationLevel] ||
        interaction.client.i18n.t('commands.guild.unknown'),
      verified: guild.verified
        ? interaction.client.i18n.t('commands.guild.yes')
        : interaction.client.i18n.t('commands.guild.no'),
      widgetChannel:
        (guild.widgetChannel
          ? `<#${guild.widgetChannel.id}>`
          : interaction.client.i18n.t('commands.guild.not_set')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      widgetChannelId:
        guild.widgetChannelId ||
        interaction.client.i18n.t('commands.guild.unknown'),
      widgetEnabled:
        (guild.widgetEnabled
          ? interaction.client.i18n.t('commands.guild.yes')
          : interaction.client.i18n.t('commands.guild.no')) ||
        interaction.client.i18n.t('commands.guild.unknown'),
      widgetImageURL:
        guild.widgetImageURL() ||
        interaction.client.i18n.t('commands.guild.none'),
    }
    const propertiesKeys = Object.keys(guildProperties)
    const propertiesData = Object.fromEntries(
      Object.entries(guildProperties).map(([key, value]) => [
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
        await interaction.editReply(
          interaction.client.i18n.t('commands.guild.available_type_list', {
            list: propertiesKeys.join(', '),
          })
        )
        break
      }
      case 'get': {
        if (!propertiesType.includes(inputAbout.toLowerCase()))
          return interaction.editReply(
            interaction.client.i18n.t('commands.guild.invalid_type')
          )

        const clientUsername = interaction.client.user.username
        const clientAvatarURL = interaction.client.user.avatarURL()
        const guildEmbed = new EmbedBuilder()
          .setTitle(interaction.client.i18n.t('commands.guild.server_info'))
          .setDescription(
            interaction.client.i18n.t('commands.guild.server_info_description')
          )
          .setColor(Colors.Blue)
          .setTimestamp()
          .setFooter({
            text: interaction.client.i18n.t('commands.guild.info_date'),
            iconURL: guildProperties.iconURL || '',
          })
          .setThumbnail(guildProperties.iconURL || '')
          .setAuthor({ name: clientUsername, iconURL: clientAvatarURL })

        guildEmbed.addFields({
          name: propertiesName,
          value: propertiesData[inputAbout.toLowerCase()],
          inline: true,
        })

        await interaction.editReply({ embeds: [guildEmbed] })
        break
      }
    }
  },
}
