const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { chatPage } = require('../../utils/browserUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask anything according to what you want.')
    .setDescriptionLocalizations({
      th: 'ถามอะไรก็ได้ตามสิ่งที่คุณต้องการ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('What do you want to ask?')
        .setDescriptionLocalizations({
          th: 'สิ่งที่ต้องการจะถาม',
        })
        .setRequired(true)
        .setMinLength(5)
    ),
  async execute(interaction) {
    const inputPrompt = interaction.options.getString('prompt')

    await interaction.deferReply()

    const response = await chatPage(inputPrompt, 'ask')

    if (response.status !== 200)
      return interaction.editReply(
        '❎ เอิ่มม...ตอนนี้ฉันยังไม่ว่าง ไว้รอฉันว่างแล้วถามฉันใหม่อีกรอบในครั้งหน้าละกันนะ'
      )

    const result = response.result

    await interaction.editReply(`\`\`\`${result}\`\`\``)
  },
}
