const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const {
  getDatabase,
  ref,
  child,
  get,
  update,
  remove,
} = require('firebase/database')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('antibot')
    .setDescription('Prevent other bots from joining the server.')
    .setDescriptionLocalizations({
      th: 'ป้องกันบอทตัวอื่นเข้าร่วมเซิร์ฟเวอร์',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('enable')
        .setDescription('Do not allow other bots to join this server.')
        .setDescriptionLocalizations({
          th: 'ห้ามไม่ให้บอทตัวอื่นเข้าร่วมเซิร์ฟเวอร์นี้',
        })
        .addBooleanOption((option) =>
          option
            .setName('all')
            .setDescription('Against every bot on this server except yourself.')
            .setDescriptionLocalizations({
              th: 'ต่อต้านบอททุกตัวที่อยู่ในเซิร์ฟเวอร์นี้ยกเว้นตัวเอง',
            })
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('disable')
        .setDescription('Stop prohibiting other bots from joining this server.')
        .setDescriptionLocalizations({
          th: 'หยุดห้ามบอทตัวอื่นเข้าร่วมเซิร์ฟเวอร์นี้',
        })
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputAll = interaction.options.getBoolean('all') ?? false

    const guildRef = child(ref(getDatabase(), 'guilds'), interaction.guild.id)
    const guildSnapshot = await get(guildRef)

    switch (subcommand) {
      case 'enable': {
        const bots = []

        if (guildSnapshot.exists()) {
          const guildData = guildSnapshot.val()

          if (guildData.antibot && guildData.antibot.enable)
            return await interaction.reply(
              interaction.client.i18n.t(
                'commands.antibot.antibot_is_currently_enabled'
              )
            )
        }
        if (!inputAll) {
          const members = await interaction.guild.members.fetch()

          members.forEach((member) => {
            if (member.user.bot) bots.push(member.id)
          })
        }

        await update(guildRef, {
          antibot: {
            enable: true,
            enabledAt: new Date().toISOString(),
            enabledBy: interaction.user.id,
            bots: inputAll ? [] : bots,
            all: inputAll,
          },
        })
        await interaction.reply(
          inputAll
            ? interaction.client.i18n.t(
                'commands.antibot.antibot_and_kick_all_bot'
              )
            : interaction.client.i18n.t('commands.antibot.enable_antibot')
        )
        break
      }
      case 'disable': {
        if (!guildSnapshot.exists())
          return await interaction.reply(
            interaction.client.i18n.t('commands.antibot.currently_disable')
          )

        const guildData = guildSnapshot.val()

        if (!guildData.antibot || !guildData.antibot.enable)
          return await interaction.reply(
            interaction.client.i18n.t('commands.antibot.currently_enable')
          )

        await remove(child(guildRef, 'antibot'))
        await interaction.reply(
          interaction.client.i18n.t('commands.antibot.disable_antibot')
        )
        break
      }
    }
  },
}
