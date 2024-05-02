const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { join } = require('node:path')
const { readFileSync } = require('node:fs')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('license')
    .setDescription('Understanding copyrighted material')
    .setDescriptionLocalizations({
      th: 'ทำความเข้าใจกับเนื้อหาที่มีลิขสิทธิ์',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const licensePath = join(__dirname, '..', '..', '..')
    const MITLicense = readFileSync(licensePath + 'LICENSE', {
      encoding: 'utf-8',
    })
    const CC0License = readFileSync(licensePath + 'LICENSE-ASSETS', {
      encoding: 'utf-8',
    })

    await interaction.reply({
      files: [
        {
          attachment: Buffer.from(MITLicense),
          name: 'LICENSE.txt',
        },
        {
          attachment: Buffer.from(CC0License),
          name: 'LICENSE-ASSETS.txt',
        },
      ],
    })
  },
}
