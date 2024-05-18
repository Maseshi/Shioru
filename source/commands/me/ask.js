const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { getDatabase, ref, get } = require('firebase/database')

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

    const token = interaction.client.configs.openai.apiKey

    if (!token)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.ask.key_not_exsist')
      )

    const chatRef = ref(getDatabase(), 'chat')
    const chatSnapshot = await get(chatRef)
    const clientUsername = interaction.client.user.username
    const userData = JSON.stringify(interaction.user.toJSON())
    const systemMessage = [
      chatSnapshot.val().system || `Your are ${clientUsername}`,
      `Here is the user's information on Discord: ${userData}.`,
    ].join(' ')

    try {
      const chatCompletion =
        await interaction.client.ai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemMessage,
            },
            { role: 'user', content: inputPrompt },
          ],
        })

      await interaction.editReply(chatCompletion.choices[0].message.content)
    } catch (error) {
      await interaction.editReply(
        interaction.client.i18n.t('commands.ask.can_not_answer_at_this_time')
      )
    }
  },
}
