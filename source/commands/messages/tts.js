const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.SendTTSMessages,
  ],
  data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Text-to-Speech')
    .setDescriptionLocalizations({
      th: 'แปลงข้อความเป็นคำพูด',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.SendTTSMessages)
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('Text to be converted to speech.')
        .setDescriptionLocalizations({
          th: 'ข้อความที่ต้องการจะแปลงเป็นคำพูด',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputContent = interaction.options.getString('content')

    await interaction.reply({ content: inputContent, tts: true })
  },
}
