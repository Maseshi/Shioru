const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
} = require('firebase/firestore')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ChangeNickname,
  ],
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Go AFK within your server.')
    .setDescriptionLocalizations({
      th: 'ไป AFK ภายในเซิร์ฟเวอร์ของคุณ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set your status to AFK.')
        .setDescriptionLocalizations({
          th: 'ตั้งสถานะของคุณเป็น AFK',
        })
        .addStringOption((option) =>
          option
            .setName('message')
            .setDescription("The reason you'll be AFK.")
            .setDescriptionLocalizations({
              th: 'เหตุผลที่คุณจะไม่อยู่ที่หน้าจอ (AFK)',
            })
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Unset your status to AFK.')
        .setDescriptionLocalizations({
          th: 'ยกเลิกตั้งสถานะของคุณเป็น AFK',
        })
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputMessage = interaction.options.getString('message') ?? ''

    const guildDoc = doc(getFirestore(), 'guilds', interaction.guild.id)
    const guildSnapshot = await getDoc(guildDoc)

    const nickname = interaction.member.nickname || interaction.user.username

    switch (subcommand) {
      case 'set':
        if (guildSnapshot.exists()) {
          const guildData = guildSnapshot.data()

          if (guildData.afk && guildData.afk[interaction.user.id]) {
            return await interaction.reply({
              content: interaction.client.i18n.t('commands.afk.currently_afk'),
              ephemeral: true,
            })
          }
        }

        await setDoc(
          guildDoc,
          {
            [interaction.user.id]: {
              message: inputMessage,
              nickname: nickname,
            },
          },
          { marge: true }
        )

        try {
          await interaction.member.setNickname('[AFK] ' + nickname)
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error,
            true
          )
        }

        await interaction.reply({
          content: interaction.client.i18n.t('commands.afk.now_afk'),
          ephemeral: true,
        })
        break
      case 'remove': {
        if (!guildSnapshot.exists())
          return await interaction.reply({
            content: interaction.client.i18n.t('commands.afk.currently_afk'),
            ephemeral: true,
          })

        const guildData = guildSnapshot.data()

        if (guildData.afk || guildData.afk[interaction.user.id])
          return await interaction.reply({
            content: interaction.client.i18n.t(
              'commands.afk.currently_not_afk'
            ),
            ephemeral: true,
          })

        const afk = guildData.afk

        try {
          await interaction.member.setNickname(
            afk[interaction.user.id].nickname
          )
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error,
            true
          )
        }

        await updateDoc(guildDoc, {
          afk: {
            [interaction.user.id]: deleteField(),
          },
        })
        await interaction.reply({
          content: interaction.client.i18n.t('commands.afk.now_not_afk'),
          ephemeral: true,
        })
        break
      }
    }
  },
}
