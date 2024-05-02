const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageGuildExpressions,
  ],
  data: new SlashCommandBuilder()
    .setName('emoji')
    .setDescription("Manage this server's emojis.")
    .setDescriptionLocalizations({
      th: 'จัดการอีโมจิของเซิร์ฟเวอร์นี้',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add emojis on this server.')
        .setDescriptionLocalizations({
          th: 'เพิ่มอีโมจิบนเซิร์ฟเวอร์นี้',
        })
        .addStringOption((option) =>
          option
            .setName('emoji')
            .setDescription('Emoji images.')
            .setDescriptionLocalizations({
              th: 'ภาพของอีโมจิ',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the emoji.')
            .setDescriptionLocalizations({
              th: 'ชื่อของอีโมจิ',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('reason')
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
        .setDescription('Remove emojis on this server.')
        .setDescriptionLocalizations({
          th: 'ลบอีโมจิบนเซิร์ฟเวอร์นี้',
        })
        .addStringOption((option) =>
          option
            .setName('emoji')
            .setDescription('Emoji ID.')
            .setDescriptionLocalizations({
              th: 'รหัสของอีโมจิ',
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
        .setDescription('Edit emojis on this server.')
        .setDescriptionLocalizations({
          th: 'แก้ไขอีโมจิบนเซิร์ฟเวอร์นี้',
        })
        .addStringOption((option) =>
          option
            .setName('emoji')
            .setDescription('Emoji ID.')
            .setDescriptionLocalizations({
              th: 'รหัสของอีโมจิ',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('The name of the emoji.')
            .setDescriptionLocalizations({
              th: 'ชื่อของอีโมจิ',
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
    const inputEmoji = interaction.options.getAttachment('emoji') ?? ''
    const inputName = interaction.options.getString('name') ?? ''
    const inputReason = interaction.options.getString('reason') ?? ''

    switch (subcommand) {
      case 'add':
        try {
          await interaction.reply(
            interaction.client.i18n.t('commands.emoji.uploading_you_emoji')
          )

          const addEmoji = await interaction.guild.emojis.create({
            attachment: inputEmoji.attachment,
            name: inputName,
            reason: inputReason,
          })

          if (!addEmoji) return

          await interaction.editReply(
            interaction.client.i18n
              .t('commands.emoji.you_emoji_is_ready')
              .replace('%s', addEmoji)
          )
        } catch (error) {
          await interaction.reply(error.rawError.message)
        }
        break
      case 'delete':
        try {
          await interaction.guild.emojis.delete({
            emoji: inputEmoji,
            reason: inputReason,
          })
          await interaction.reply(
            interaction.client.i18n
              .t('commands.emoji.deleted_emoji')
              .replace('%s', inputEmoji)
          )
        } catch (error) {
          await interaction.reply(error.rawError.message)
        }
        break
      case 'edit':
        try {
          const editEmoji = await interaction.guild.emojis.edit({
            emoji: inputEmoji,
            name: inputName,
            reason: inputReason,
          })

          await interaction.reply(
            interaction.client.i18n
              .t('commands.emoji.edited_emoji')
              .replace('%s', editEmoji)
          )
        } catch (error) {
          await interaction.reply(error.rawError.message)
        }
        break
    }
  },
}
