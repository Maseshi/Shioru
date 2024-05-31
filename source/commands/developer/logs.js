const {
  SlashCommandBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
} = require('discord.js')
const { join } = require('node:path')
const { existsSync, readFileSync, unlinkSync } = require('node:fs')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Manage log files to check functionality or fix bugs.')
    .setDescriptionLocalizations({
      th: 'จัดการไฟล์เอกสารบันทึกเพื่อตรวจสอบการทำงานหรือแก้ไขข้อบกพร่อง',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('get')
        .setDescription('Download work memorandum files')
        .setDescriptionLocalizations({
          th: 'ดาวน์โหลดไฟล์เอกสารบันทึกเกี่ยวกับการทำงาน',
        })
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('Type of document file')
            .setDescriptionLocalizations({
              th: 'ประเภทของไฟล์เอกสารบันทึก',
            })
            .setRequired(true)
            .setChoices(
              { name: 'app', value: 'app.log' },
              { name: 'debug', value: 'debug.json.log' },
              { name: 'error', value: 'error.json.log' },
              { name: 'fetal', value: 'fetal.json.log' },
              { name: 'info', value: 'info.json.log' },
              { name: 'trace', value: 'trace.json.log' },
              { name: 'warn', value: 'warn.json.log' }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('Remove unwanted log files from the folder.')
        .setDescriptionLocalizations({
          th: 'ลบไฟล์ล็อกที่ไม่ต้องการออกจากโฟลเดอร์',
        })
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('Type of document file')
            .setDescriptionLocalizations({
              th: 'ประเภทของไฟล์เอกสารบันทึก',
            })
            .setRequired(true)
            .setChoices(
              { name: 'app', value: 'app.log' },
              { name: 'debug', value: 'debug.json.log' },
              { name: 'error', value: 'error.json.log' },
              { name: 'fetal', value: 'fetal.json.log' },
              { name: 'info', value: 'info.json.log' },
              { name: 'trace', value: 'trace.json.log' },
              { name: 'warn', value: 'warn.json.log' }
            )
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputType = interaction.options.getString('type')

    const directory = join('logs')
    const file = join(directory, inputType)
    const teamOwner = interaction.client.configs.team.owner
    const teamDev = interaction.client.configs.team.developer

    if (!existsSync(directory))
      return await interaction.reply(
        interaction.client.i18n.t('commands.logs.empty_directory')
      )
    if (!existsSync(file))
      return await interaction.reply(
        interaction.client.i18n.t('commands.logs.file_missing')
      )

    switch (subcommand) {
      case 'get': {
        const attachment = new AttachmentBuilder(file, {
          name: inputType,
          description: interaction.client.i18n.t(
            'commands.logs.attachment_description'
          ),
        })
        const fileContent = readFileSync(file, { encoding: 'utf-8' })

        if (fileContent <= 1)
          return await interaction.reply(
            interaction.client.i18n.t('commands.logs.empty_content')
          )

        await interaction.reply({
          content: interaction.client.i18n.t('commands.logs.found_file'),
          files: [attachment],
        })
        break
      }
      case 'delete': {
        if (
          interaction.user.id !== teamOwner ||
          !teamDev.includes(interaction.user.id)
        )
          return await interaction.reply(
            interaction.client.i18n.t('commands.logs.only_owner_and_developers')
          )

        unlinkSync(file)
        await interaction.reply(
          interaction.client.i18n.t('commands.logs.file_has_been_deleted')
        )
        break
      }
    }
  },
}
