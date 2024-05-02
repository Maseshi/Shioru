const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { post } = require('axios').default

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('paste')
    .setDescription('Paste the text in sourceb.in.')
    .setDescriptionLocalizations({
      th: 'วางข้อความใน sourceb.in',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('Content to be placed')
        .setDescriptionLocalizations({
          th: 'เนื้อหาที่ต้องการจะวาง',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('The title is about the content to be pasted.')
        .setDescriptionLocalizations({
          th: 'ชื่อเรื่องเกี่ยวกับเนื้อหาที่จะวาง',
        })
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Description of what you are writing.')
        .setDescriptionLocalizations({
          th: 'คำอธิบายของสิ่งคุณกำลังเขียน',
        })
    ),
  async execute(interaction) {
    const inputTitle = interaction.options.getString('title') ?? ''
    const inputDescription = interaction.options.getString('description') ?? ''
    const inputContent = interaction.options.getString('content')

    const response = await post('https://sourceb.in/api/bins', {
      title: inputTitle,
      description: inputDescription,
      files: [
        {
          name: inputTitle,
          content: inputContent,
        },
      ],
    })

    if (response.status !== 200)
      return await interaction.reply(
        interaction.client.i18n.t('commands.paste.backend_not_response')
      )

    const key = response.data.key
    const url = `https://sourceb.in/${key}`
    const raw = `https://cdn.sourceb.in/bins/${key}/0`

    await interaction.reply(
      [
        '**Sourcebin**',
        `🔸 ${interaction.client.i18n.t('commands.paste.file')}: <%s1>`,
        `🔹 ${interaction.client.i18n.t('commands.paste.raw')}: <%s2>`,
      ]
        .join('\n')
        .replace('%s1', url)
        .replace('%s2', raw)
    )
  },
}
