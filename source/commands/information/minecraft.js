const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')
const { get } = require('axios').default

module.exports = {
  category: 'information',
  permissions: [PermissionFlagsBits.SendMessages],
  usage: 'minecraft',
  data: new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Check server or skin status in Minecraft.')
    .setDescriptionLocalizations({
      th: 'ตรวจสอบสถานะเซิร์ฟเวอร์หรือสกินใน Minecraft.',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('status')
        .setDescription('Explore Minecraft Server Info')
        .setDescriptionLocalizations({
          th: 'สำรวจข้อมูลเซิร์ฟเวอร์ Minecraft',
        })
        .addStringOption((option) =>
          option
            .setName('ip')
            .setDescription('IP address of Minecraft server')
            .setDescriptionLocalizations({
              th: 'ที่อยู่ IP ของเซิร์ฟเวอร์ Minecraft (ตัวอย่าง: 127.0.0.1:25565)',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('skin')
        .setDescription("Get the player's skin.")
        .setDescriptionLocalizations({
          th: 'รับสกินของผู้เล่นดังกล่าว',
        })
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription("Player's name")
            .setDescriptionLocalizations({
              th: 'ชื่อของผู้เล่น',
            })
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputIP = interaction.options.getString('ip') ?? ''
    const inputName = interaction.options.getString('name') ?? ''

    const clientUsername = interaction.client.user.username
    const clientAvatar = interaction.client.user.displayAvatarURL()

    switch (subcommand) {
      case 'status': {
        const statusEmbed = new EmbedBuilder()
          .setColor(Colors.Green)
          .setAuthor({ name: clientUsername, iconURL: clientAvatar })
          .setDescription(
            '```' +
              interaction.client.i18n.t('commands.minecraft.server_available') +
              '```'
          )
          .setTimestamp()
          .setFooter({
            text: interaction.client.i18n.t('commands.minecraft.last_check'),
            iconURL:
              'https://em-content.zobj.net/thumbs/120/microsoft/319/three-oclock_1f552.png',
          })
        const statusErrorEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setAuthor({ name: clientUsername, iconURL: clientAvatar })
          .setDescription(
            '```' +
              interaction.client.i18n.t(
                'commands.minecraft.server_unavailable'
              ) +
              '```'
          )
          .setTimestamp()
          .setFooter({
            text: interaction.client.i18n.t('commands.minecraft.last_check'),
            iconURL:
              'https://em-content.zobj.net/thumbs/120/microsoft/319/three-oclock_1f552.png',
          })

        try {
          const response = await get('https://api.mcsrvstat.us/2/' + inputIP)

          if (!response.data.online)
            return await interaction.reply({
              embeds: [statusErrorEmbed],
            })

          const host = response.data.hostname
          const ip = response.data.ip
          const icon = response.data.icon
            ? new AttachmentBuilder(
                new Buffer.from(response.data.icon.split(',')[1], 'base64'),
                { name: 'icon.png' }
              )
            : ''
          const port = response.data.port.toString()
          const version =
            response.data.version ??
            interaction.client.i18n.t('commands.minecraft.do_not_have')
          const maxPlayers = response.data.players.max.toString()
          const onlinePlayers = response.data.players.online
            ? response.data.players.online.toString()
            : interaction.client.i18n.t('commands.minecraft.do_not_have')
          const motd = response.data.motd.clean.join('\n')

          statusEmbed
            .setThumbnail(response.data.icon ? 'attachment://icon.png' : null)
            .addFields(
              {
                name: interaction.client.i18n.t('commands.minecraft.address'),
                value: host,
                inline: true,
              },
              {
                name: interaction.client.i18n.t('commands.minecraft.ip'),
                value: ip,
                inline: true,
              },
              {
                name: interaction.client.i18n.t('commands.minecraft.port'),
                value: port,
                inline: true,
              },
              {
                name: interaction.client.i18n.t('commands.minecraft.version'),
                value: version,
                inline: true,
              },
              {
                name: interaction.client.i18n.t(
                  'commands.minecraft.maximum_player_count'
                ),
                value: maxPlayers,
                inline: true,
              },
              {
                name: interaction.client.i18n.t(
                  'commands.minecraft.player_in_server'
                ),
                value: onlinePlayers,
                inline: true,
              },
              {
                name: interaction.client.i18n.t('commands.minecraft.motd'),
                value: '```' + motd + '```',
                inline: false,
              }
            )

          await interaction.reply({
            embeds: [statusEmbed],
            files: [response.data.icon ? icon : null],
          })
        } catch (error) {
          await interaction.reply({ embeds: [statusErrorEmbed] })
        }
        break
      }
      case 'skin': {
        const skinEmbed = new EmbedBuilder()
          .setColor(Colors.Green)
          .setAuthor({ name: clientUsername, iconURL: clientAvatar })
          .setTitle(interaction.client.i18n.t('commands.minecraft.skin_of'))
          .setImage('attachment://skin.png')
          .setTimestamp()

        await interaction.reply({
          embeds: [skinEmbed],
          files: [
            new AttachmentBuilder(
              'https://minotar.net/armor/body/' + inputName + '/700.png',
              { name: 'skin.png' }
            ),
          ],
        })
        break
      }
    }
  },
}
