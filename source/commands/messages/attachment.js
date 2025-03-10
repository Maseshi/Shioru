const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.AttachFiles,
  ],
  data: new SlashCommandBuilder()
    .setName('attachment')
    .setDescription('Upload the file and send it in the chat.')
    .setDescriptionLocalizations({ th: 'อัปโหลดไฟล์แล้วส่งไปในแชท' })
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addAttachmentOption((option) =>
      option
        .setName('attachment')
        .setDescription('Things to be attached to the message to be sent.')
        .setDescriptionLocalizations({
          th: 'สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง',
        })
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to send the attachment to')
        .setDescriptionLocalizations({ th: 'ช่องที่จะส่งไฟล์' })
        .setRequired(false)
    ),
  async execute(interaction) {
    const inputAttachment = interaction.options.getAttachment('attachment')
    const inputChannel = interaction.options.getChannel('channel') ?? null

    if (!inputChannel) {
      await interaction.channel.send({ files: [inputAttachment] })
    } else {
      await inputChannel.send({ files: [inputAttachment] })
    }

    await interaction.reply({
      content: inputChannel
        ? interaction.client.i18n.t('commands.attachment.sended_to_channel')
        : interaction.client.i18n.t('commands.attachment.sended', {
            id: inputChannel.id,
          }),
      ephemeral: true,
    })
  },
}
