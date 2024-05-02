const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ModerateMembers,
  ],
  data: new SlashCommandBuilder()
    .setName('captcha')
    .setDescription('Setup the captcha verification system.')
    .setDescriptionLocalizations({
      th: 'ตั้งค่าระบบตรวจสอบ captcha',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('setup')
        .setDescription('Set up the Captcha system')
        .setDescriptionLocalizations({
          th: 'ตั้งค่าระบบ Captcha',
        })
        .addRoleOption((option) =>
          option
            .setName('role')
            .setDescription('Role or rank when confirmed.')
            .setDescriptionLocalizations({
              th: 'บทบาทหรือยศเมื่อผ่านการยืนยัน',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('captcha')
            .setDescription('The name you want the captcha to generate.')
            .setDescriptionLocalizations({
              th: 'ชื่อที่คุณต้องการให้ captcha สร้างขึ้นมา',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('enable')
        .setDescription('Enable the captcha system.')
        .setDescriptionLocalizations({
          th: 'เปิดใช้งานระบบ captcha',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('disable')
        .setDescription('Disable the captcha system.')
        .setDescriptionLocalizations({
          th: 'ปิดใช้งานระบบ captcha',
        })
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputRole = interaction.options.getRole('role') ?? ''
    const inputCaptcha = interaction.options.getString('captcha') ?? ''

    const guildDoc = doc(getFirestore(), 'guilds', interaction.guild.id)
    const guildSnapshot = await getDoc(guildDoc)
    const guildData = guildSnapshot.data()

    switch (subcommand) {
      case 'setup':
        await setDoc(
          guildDoc,
          {
            captcha: {
              enable: true,
              role: inputRole.id,
              text: inputCaptcha,
            },
          },
          { marge: true }
        )

        await interaction.reply(
          interaction.client.i18n.t('commands.captcha.captcha_setup_success')
        )
        break
      case 'enable':
        if (!guildSnapshot.exists())
          return await interaction.reply(
            interaction.client.i18n.t('commands.captcha.need_to_setup_before')
          )
        if (guildData.enable)
          return await interaction.reply(
            interaction.client.i18n.t('commands.captcha.currently_enable')
          )

        await setDoc(
          guildDoc,
          {
            captcha: {
              enable: true,
            },
          },
          { marge: true }
        )
        await interaction.reply(
          interaction.client.i18n.t('commands.captcha.enabled_captcha')
        )
        break
      case 'disable':
        if (!guildSnapshot.exists())
          return await interaction.reply(
            interaction.client.i18n.t('commands.captcha.need_to_setup_before')
          )
        if (!guildData.enable)
          return await interaction.reply(
            interaction.client.i18n.t('commands.captcha.currently_disable')
          )

        await setDoc(
          guildDoc,
          {
            captcha: {
              enable: false,
            },
          },
          { marge: true }
        )
        await interaction.reply(
          interaction.client.i18n.t('commands.captcha.disabled_captcha')
        )
        break
    }
  },
}
