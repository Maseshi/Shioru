const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  OAuth2Scopes,
  InteractionContextType,
} = require('discord.js')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.CreateInstantInvite,
  ],
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Create and receive invitation links to join the server.')
    .setDescriptionLocalizations({
      th: 'สร้างและรับลิงค์คำเชิญเพื่อเข้าร่วมเซิร์ฟเวอร์',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName('guild')
        .setDescription('Create an invitation link for joining this server.')
        .setDescriptionLocalizations({
          th: 'สร้างลิงค์คำเชิญสำหรับเข้าร่วมเซิร์ฟเวอร์นี้',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('me')
        .setDescription('Invite me to other servers.')
        .setDescriptionLocalizations({ th: 'เชิญฉันไปยังเซิร์ฟเวอร์อื่นๆ' })
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()

    switch (subcommand) {
      case 'guild': {
        const invite = await interaction.channel.createInvite()
        const guildIcon = interaction.guild.iconURL()
        const inviteEmbed = new EmbedBuilder()
          .setTitle(
            interaction.client.i18n.t(
              'commands.invite.membership_invitation_card'
            )
          )
          .setDescription(`||${invite.url}||`)
          .setColor('LightGrey')
          .setFooter({
            text: interaction.client.i18n.t(
              'commands.invite.this_product_is_free'
            ),
            iconURL: guildIcon,
          })

        await interaction.reply({ embeds: [inviteEmbed] })
        break
      }
      case 'me': {
        try {
          const link = interaction.client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
            permissions: [PermissionFlagsBits.Administrator],
          })

          await interaction.reply(link)
        } catch (error) {
          await interaction.reply(
            interaction.client.i18n.t(
              'commands.invite.can_not_create_invite_link'
            )
          )
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error,
            true
          )
        }
        break
      }
    }
  },
}
