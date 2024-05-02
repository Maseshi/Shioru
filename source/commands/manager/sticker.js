const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageGuildExpressions,
  ],
  data: new SlashCommandBuilder()
    .setName('sticker')
    .setDescription("Manage this server's stickers.")
    .setDescriptionLocalizations({
      th: 'จัดการสติ๊กเกอร์ของเซิร์ฟเวอร์นี้',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add stickers on this server.')
        .setDescriptionLocalizations({
          th: 'เพิ่มสติ๊กเกอร์บนเซิร์ฟเวอร์นี้',
        })
        .addStringOption((option) =>
          option
            .setName('file')
            .setDescription('Sticker image file.')
            .setDescriptionLocalizations({
              th: 'ไฟล์ภาพของสติ๊กเกอร์',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name for the sticker')
            .setDescriptionLocalizations({
              th: 'ชื่อของสติ๊กเกอร์',
            })
            .setRequired(true)
            .setMinLength(2)
        )
        .addStringOption((option) =>
          option
            .setName('tags')
            .setDescription(
              "The Discord name of a unicode emoji representing the sticker's expression"
            )
            .setDescriptionLocalizations({
              th: 'ชื่อ Discord ของอีโมจิ Unicode ที่แสดงถึงการแสดงออกของสติกเกอร์',
            })
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('Reason for creation.')
            .setDescriptionLocalizations({
              th: 'เหตุผลของการเพิ่ม',
            })
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('Remove stickers on this server.')
        .setDescriptionLocalizations({
          th: 'ลบสติ๊กเกอร์บนเซิร์ฟเวอร์นี้',
        })
        .addStringOption((option) =>
          option
            .setName('sticker')
            .setDescription('Sticker ID.')
            .setDescriptionLocalizations({
              th: 'รหัสของสติ๊กเกอร์',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for deletion.')
            .setDescriptionLocalizations({
              th: 'เหตุผลของการลบ',
            })
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('edit')
        .setDescription('Edit stickers on this server.')
        .setDescriptionLocalizations({
          th: 'แก้ไขสติ๊กเกอร์บนเซิร์ฟเวอร์นี้',
        })
        .addStringOption((option) =>
          option
            .setName('sticker')
            .setDescription('Sticker ID.')
            .setDescriptionLocalizations({
              th: 'รหัสของสติ๊กเกอร์',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the sticker.')
            .setDescriptionLocalizations({
              th: 'ชื่อของสติ๊กเกอร์',
            })
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('tags')
            .setDescription(
              "The Discord name of a unicode emoji representing the sticker's expression"
            )
            .setDescriptionLocalizations({
              th: 'ชื่อ Discord ของอีโมจิ Unicode ที่แสดงถึงการแสดงออกของสติกเกอร์',
            })
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('The description for the sticker')
            .setDescriptionLocalizations({
              th: 'คำอธิบายของสติ๊กเกอร์',
            })
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName('reason')
            .setDescription('Reason for deletion.')
            .setDescriptionLocalizations({
              th: 'เหตุผลของการลบ',
            })
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputFile = interaction.options.getAttachment('file') ?? ''
    const inputSticker = interaction.options.getString('sticker') ?? ''
    const inputName = interaction.options.getString('name') ?? ''
    const inputTags = interaction.options.getString('tags') ?? ''
    const inputDescription = interaction.options.getString('description') ?? ''
    const inputReason = interaction.options.getString('reason') ?? ''

    switch (subcommand) {
      case 'add':
        if (inputFile.contentType === 'image/gif')
          return await interaction.reply(
            interaction.client.i18n.t('commands.sticker.does_not_support_gif')
          )

        try {
          await interaction.reply(
            interaction.client.i18n.t('commands.sticker.uploading_you_sticker')
          )

          const addSticker = await interaction.guild.stickers.create({
            attachment: inputFile.attachment,
            name: inputName,
            tags: inputTags,
            description: inputDescription,
            reason: inputReason,
          })

          if (!addSticker) return

          await interaction.editReply(
            interaction.client.i18n
              .t('commands.sticker.you_sticker_is_ready')
              .replace('%s', inputName)
          )
        } catch (error) {
          await interaction.reply(error.rawError.message)
        }
        break
      case 'delete':
        try {
          await interaction.guild.stickers.delete({
            sticker: inputSticker,
            reason: inputReason,
          })
          await interaction.reply(
            interaction.client.i18n
              .t('commands.sticker.deleted_sticker')
              .replace('%s', inputSticker)
          )
        } catch (error) {
          await interaction.reply(error.rawError.message)
        }
        break
      case 'edit':
        try {
          const editSticker = await interaction.guild.stickers.edit({
            sticker: inputSticker,
            name: inputName,
            description: inputDescription,
            tags: inputTags,
            reason: inputReason,
          })

          await interaction.reply(
            interaction.client.i18n
              .t('commands.sticker.edited_sticker')
              .replace('%s', editSticker)
          )
        } catch (error) {
          await interaction.reply(error.rawError.message)
        }
        break
    }
  },
}
