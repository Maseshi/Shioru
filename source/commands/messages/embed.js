const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')
const { embedBuilder } = require('../../utils/clientUtils')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create an embedded message')
    .setDescriptionLocalizations({ th: 'สร้างข้อความแบบฝัง' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName('send')
        .setDescription('Send embedded message')
        .setDescriptionLocalizations({ th: 'ส่งข้อความแบบฝัง' })
        .addStringOption((option) =>
          option
            .setName('content')
            .setDescription('Content of message.')
            .setDescriptionLocalizations({ th: 'เนื้อหาของข้อความ' })
        )
        .addAttachmentOption((option) =>
          option
            .setName('attachment')
            .setDescription(
              'What needs to be attached to the embedded message to be sent.'
            )
            .setDescriptionLocalizations({
              th: 'สิ่งที่ต้องการแนบไปด้วยข้อความแบบฝังที่จะส่ง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_name')
            .setDescription('The name of the author of the embedded text.')
            .setDescriptionLocalizations({
              th: 'ชื่อของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_icon_url')
            .setDescription('Author icon in embedded text')
            .setDescriptionLocalizations({
              th: 'ไอคอนของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_url')
            .setDescription('Author links in embedded text')
            .setDescriptionLocalizations({
              th: 'ลิงค์ของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('color')
            .setDescription('Embedded text border color')
            .setDescriptionLocalizations({ th: 'สีของขอบข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('Topic of embedded message')
            .setDescriptionLocalizations({ th: 'หัวข้อของข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription(
              'The link to be attached to the topic of the embedded message.'
            )
            .setDescriptionLocalizations({
              th: 'ลิงค์ที่จะแนบไว้กับหัวข้อของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('Description in embedded text')
            .setDescriptionLocalizations({ th: 'คำอธิบายในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('thumbnail')
            .setDescription(
              'Link to thumbnail in upper right corner in embedded text'
            )
            .setDescriptionLocalizations({
              th: 'ลิงค์ของรูปขนาดเล็กมุมขวาบนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName(`first_field_name`)
            .setDescription('The name of the field in the embedded text.')
            .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName(`first_field_value`)
            .setDescription('Field values in embedded text')
            .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' })
        )
        .addBooleanOption((option) =>
          option
            .setName(`first_field_inline`)
            .setDescription(
              'Organized as a single line in a field of embedded text.'
            )
            .setDescriptionLocalizations({
              th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName(`second_field_name`)
            .setDescription('The name of the field in the embedded text.')
            .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName(`second_field_value`)
            .setDescription('Field values in embedded text')
            .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' })
        )
        .addBooleanOption((option) =>
          option
            .setName(`second_field_inline`)
            .setDescription(
              'Organized as a single line in a field of embedded text.'
            )
            .setDescriptionLocalizations({
              th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('image')
            .setDescription('Links to accompanying images in embedded text')
            .setDescriptionLocalizations({
              th: 'ลิงค์รูปภาพประกอบในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('timestamp')
            .setDescription(
              'Timestamp on embedded text (We recommend using https://www.epochconverter.com/) e.g. "1701090235"'
            )
            .setDescriptionLocalizations({
              th: 'เวลาประทับบนข้อความแบบฝัง (เราแนะนำให้ใช้ https://www.epochconverter.com/) เช่น "1701090235"',
            })
        )
        .addStringOption((option) =>
          option
            .setName('footer_text')
            .setDescription('Embedded footer text')
            .setDescriptionLocalizations({
              th: 'ข้อความส่วนท้ายของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('footer_icon_url')
            .setDescription('Icon link in footer of embedded message')
            .setDescriptionLocalizations({
              th: 'ลิงค์ของไอคอนในส่วนท้ายของข้อความแบบฝัง',
            })
        )
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('channel to send the embedded message')
            .setDescriptionLocalizations({ th: 'ช่องที่จะส่งข้อความแบบฝัง' })
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('reply')
        .setDescription('Reply embedded message')
        .setDescriptionLocalizations({ th: 'ตอบกลับข้อความแบบฝัง' })
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('ID of the embedded message you want to rply')
            .setDescriptionLocalizations({
              th: 'ไอดีของข้อความแบบฝังที่ต้องการตอบกลับ',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('content')
            .setDescription('Content of message.')
            .setDescriptionLocalizations({ th: 'เนื้อหาของข้อความ' })
        )
        .addAttachmentOption((option) =>
          option
            .setName('attachment')
            .setDescription(
              'What needs to be attached to the embedded message to be sent.'
            )
            .setDescriptionLocalizations({
              th: 'สิ่งที่ต้องการแนบไปด้วยข้อความแบบฝังที่จะส่ง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_name')
            .setDescription('The name of the author of the embedded text.')
            .setDescriptionLocalizations({
              th: 'ชื่อของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_icon_url')
            .setDescription('Author icon in embedded text')
            .setDescriptionLocalizations({
              th: 'ไอคอนของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_url')
            .setDescription('Author links in embedded text')
            .setDescriptionLocalizations({
              th: 'ลิงค์ของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('color')
            .setDescription('Embedded text border color')
            .setDescriptionLocalizations({ th: 'สีของขอบข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('Topic of embedded message')
            .setDescriptionLocalizations({ th: 'หัวข้อของข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription(
              'The link to be attached to the topic of the embedded message.'
            )
            .setDescriptionLocalizations({
              th: 'ลิงค์ที่จะแนบไว้กับหัวข้อของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('Description in embedded text')
            .setDescriptionLocalizations({ th: 'คำอธิบายในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('thumbnail')
            .setDescription(
              'Link to thumbnail in upper right corner in embedded text'
            )
            .setDescriptionLocalizations({
              th: 'ลิงค์ของรูปขนาดเล็กมุมขวาบนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName(`first_field_name`)
            .setDescription('The name of the field in the embedded text.')
            .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName(`first_field_value`)
            .setDescription('Field values in embedded text')
            .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' })
        )
        .addBooleanOption((option) =>
          option
            .setName(`first_field_inline`)
            .setDescription(
              'Organized as a single line in a field of embedded text.'
            )
            .setDescriptionLocalizations({
              th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName(`second_field_name`)
            .setDescription('The name of the field in the embedded text.')
            .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName(`second_field_value`)
            .setDescription('Field values in embedded text')
            .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' })
        )
        .addBooleanOption((option) =>
          option
            .setName(`second_field_inline`)
            .setDescription(
              'Organized as a single line in a field of embedded text.'
            )
            .setDescriptionLocalizations({
              th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('image')
            .setDescription('Links to accompanying images in embedded text')
            .setDescriptionLocalizations({
              th: 'ลิงค์รูปภาพประกอบในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('timestamp')
            .setDescription(
              'Timestamp on embedded text (We recommend using https://www.epochconverter.com/) e.g. "1701090235"'
            )
            .setDescriptionLocalizations({
              th: 'เวลาประทับบนข้อความแบบฝัง (เราแนะนำให้ใช้ https://www.epochconverter.com/) เช่น "1701090235"',
            })
        )
        .addStringOption((option) =>
          option
            .setName('footer_text')
            .setDescription('Embedded footer text')
            .setDescriptionLocalizations({
              th: 'ข้อความส่วนท้ายของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('footer_icon_url')
            .setDescription('Icon link in footer of embedded message')
            .setDescriptionLocalizations({
              th: 'ลิงค์ของไอคอนในส่วนท้ายของข้อความแบบฝัง',
            })
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('edit')
        .setDescription('Edit embedded message')
        .setDescriptionLocalizations({ th: 'แก้ไขข้อความแบบฝัง' })
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('ID of the embedded message you want to edit')
            .setDescriptionLocalizations({
              th: 'ไอดีของข้อความแบบฝังที่ต้องการแก้ไข',
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('content')
            .setDescription('Content of message.')
            .setDescriptionLocalizations({ th: 'เนื้อหาของข้อความ' })
        )
        .addAttachmentOption((option) =>
          option
            .setName('attachment')
            .setDescription(
              'What needs to be attached to the embedded message to be sent.'
            )
            .setDescriptionLocalizations({
              th: 'สิ่งที่ต้องการแนบไปด้วยข้อความแบบฝังที่จะส่ง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_name')
            .setDescription('The name of the author of the embedded text.')
            .setDescriptionLocalizations({
              th: 'ชื่อของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_icon_url')
            .setDescription('Author icon in embedded text')
            .setDescriptionLocalizations({
              th: 'ไอคอนของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('author_url')
            .setDescription('Author links in embedded text')
            .setDescriptionLocalizations({
              th: 'ลิงค์ของผู้เขียนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('color')
            .setDescription('Embedded text border color')
            .setDescriptionLocalizations({ th: 'สีของขอบข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('title')
            .setDescription('Topic of embedded message')
            .setDescriptionLocalizations({ th: 'หัวข้อของข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription(
              'The link to be attached to the topic of the embedded message.'
            )
            .setDescriptionLocalizations({
              th: 'ลิงค์ที่จะแนบไว้กับหัวข้อของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('description')
            .setDescription('Description in embedded text')
            .setDescriptionLocalizations({ th: 'คำอธิบายในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName('thumbnail')
            .setDescription(
              'Link to thumbnail in upper right corner in embedded text'
            )
            .setDescriptionLocalizations({
              th: 'ลิงค์ของรูปขนาดเล็กมุมขวาบนในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName(`first_field_name`)
            .setDescription('The name of the field in the embedded text.')
            .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName(`first_field_value`)
            .setDescription('Field values in embedded text')
            .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' })
        )
        .addBooleanOption((option) =>
          option
            .setName(`first_field_inline`)
            .setDescription(
              'Organized as a single line in a field of embedded text.'
            )
            .setDescriptionLocalizations({
              th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName(`second_field_name`)
            .setDescription('The name of the field in the embedded text.')
            .setDescriptionLocalizations({ th: 'ชื่อของฟิลด์ในข้อความแบบฝัง' })
        )
        .addStringOption((option) =>
          option
            .setName(`second_field_value`)
            .setDescription('Field values in embedded text')
            .setDescriptionLocalizations({ th: 'ค่าของฟิลด์ในข้อความแบบฝัง' })
        )
        .addBooleanOption((option) =>
          option
            .setName(`second_field_inline`)
            .setDescription(
              'Organized as a single line in a field of embedded text.'
            )
            .setDescriptionLocalizations({
              th: 'จัดเป็นบรรทัดเดียวในฟิลด์ของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('image')
            .setDescription('Links to accompanying images in embedded text')
            .setDescriptionLocalizations({
              th: 'ลิงค์รูปภาพประกอบในข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('timestamp')
            .setDescription(
              'Timestamp on embedded text (We recommend using https://www.epochconverter.com/) e.g. "1701090235"'
            )
            .setDescriptionLocalizations({
              th: 'เวลาประทับบนข้อความแบบฝัง (เราแนะนำให้ใช้ https://www.epochconverter.com/) เช่น "1701090235"',
            })
        )
        .addStringOption((option) =>
          option
            .setName('footer_text')
            .setDescription('Embedded footer text')
            .setDescriptionLocalizations({
              th: 'ข้อความส่วนท้ายของข้อความแบบฝัง',
            })
        )
        .addStringOption((option) =>
          option
            .setName('footer_icon_url')
            .setDescription('Icon link in footer of embedded message')
            .setDescriptionLocalizations({
              th: 'ลิงค์ของไอคอนในส่วนท้ายของข้อความแบบฝัง',
            })
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('suppress')
        .setDescription('Suppresses or unsuppresses embeds on a message.')
        .setDescriptionLocalizations({ th: 'ระงับหรือยกเลิกการฝังข้อความ' })
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription(
              'ID of the message for which you want to suppress or unembed the message.'
            )
            .setDescriptionLocalizations({
              th: 'ไอดีของข้อความที่ต้องการระงับหรือยกเลิกการฝังข้อความ',
            })
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName('suppress')
            .setDescription('Want to suppress message embedding?')
            .setDescriptionLocalizations({
              th: 'ต้องการระงับการฝังข้อความหรือไม่',
            })
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputID = interaction.options.getString('id')
    const inputContent = interaction.options.getString('content') ?? ''
    const inputSuppress = interaction.options.getString('suppress')
    const inputAttachment =
      interaction.options.getAttachment('attachment') ?? null
    const inputAuthorName = interaction.options.getString('author_name') ?? ''
    const inputAuthorURL = interaction.options.getString('author_url') ?? ''
    const inputAuthorIconURL =
      interaction.options.getString('author_icon_url') ?? ''
    const inputColor = interaction.options.getString('color') ?? ''
    const inputTitle = interaction.options.getString('title')
    const inputURL = interaction.options.getString('url') ?? ''
    const inputDescription = interaction.options.getString('description') ?? ''
    const inputThumbnail = interaction.options.getString('thumbnail') ?? ''
    const inputFirstFieldName =
      interaction.options.getString('first_field_name') ?? ''
    const inputFirstFieldValue =
      interaction.options.getString('first_field_value') ?? ''
    const inputFirstFieldInline =
      interaction.options.getBoolean('first_field_inline') ?? ''
    const inputSecondFieldName =
      interaction.options.getString('second_field_name') ?? ''
    const inputSecondFieldValue =
      interaction.options.getString('second_field_value') ?? ''
    const inputSecondFieldInline =
      interaction.options.getBoolean('second_field_inline') ?? ''
    const inputImage = interaction.options.getString('image') ?? ''
    const inputTimestamp = interaction.options.getString('timestamp') ?? null
    const inputFooterText = interaction.options.getString('footer_text') ?? ''
    const inputFooterIconURL =
      interaction.options.getString('footer_icon_url') ?? ''
    const inputChannel = interaction.options.getChannel('channel') ?? null

    if (
      interaction.options.data.length <= 0 ||
      (interaction.options.data.length <= 1 &&
        interaction.options.data[0].name === 'channel')
    )
      return await interaction.reply(
        interaction.client.i18n.t('commands.embed.no_option_provided')
      )

    const embed = embedBuilder(
      interaction.client,
      inputAuthorName,
      inputAuthorURL,
      inputAuthorIconURL,
      inputColor,
      inputTitle,
      inputURL,
      inputDescription,
      inputThumbnail,
      inputFirstFieldName,
      inputFirstFieldValue,
      inputFirstFieldInline,
      inputSecondFieldName,
      inputSecondFieldValue,
      inputSecondFieldInline,
      inputImage,
      inputTimestamp,
      inputFooterText,
      inputFooterIconURL
    )

    if (embed.error)
      return await interaction.reply({ content: embed.data, ephemeral: true })

    switch (subcommand) {
      case 'send': {
        if (inputChannel) {
          inputChannel.send({
            content: inputContent,
            embeds: [embed.data],
            files: [inputAttachment],
          })
        } else {
          await interaction.reply({
            content: inputContent,
            embeds: [embed.data],
            files: [inputAttachment],
          })
        }

        await interaction.reply({
          content: inputChannel
            ? interaction.client.i18n.t(
                'commands.embed.embedded_has_been_sent_to_channel',
                { id: inputChannel.id }
              )
            : interaction.client.i18n.t(
                'commands.embed.embedded_has_been_sent'
              ),
          ephemeral: true,
        })
        break
      }
      case 'reply': {
        try {
          const message = await interaction.channel.messages.fetch(inputID)

          if (!message)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                'commands.embed.message_not_found'
              ),
              ephemeral: true,
            })

          await message.reply({
            content: inputContent,
            embeds: [embed.data],
            files: [inputAttachment],
          })
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error
          )
        }

        await interaction.reply({
          content: interaction.client.i18n.t(
            'commands.embed.embedded_has_been_replied'
          ),
          ephemeral: true,
        })
        break
      }
      case 'edit': {
        try {
          const message = await interaction.channel.messages.fetch(inputID)

          if (!message)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                'commands.embed.message_not_found'
              ),
              ephemeral: true,
            })
          if (!message.editable)
            return await interaction.reply({
              content: interaction.client.i18n.t('commands.embed.can_not_edit'),
              ephemeral: true,
            })

          await message.edit({
            content: inputContent,
            embeds: [embed.data],
            files: [inputAttachment],
          })
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error
          )
        }

        await interaction.reply({
          content: interaction.client.i18n.t(
            'commands.embed.embedded_has_been_edited'
          ),
          ephemeral: true,
        })
        break
      }
      case 'suppress': {
        try {
          const message = await interaction.channel.messages.fetch(inputID)

          if (!message)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                'commands.embed.message_not_found'
              ),
              ephemeral: true,
            })
          if (!message.embeds)
            return await interaction.reply({
              content: interaction.client.i18n.t('commands.embed.is_not_embed'),
              ephemeral: true,
            })

          await message.suppressEmbeds(inputSuppress)
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error
          )
        }

        await interaction.reply({
          content: inputSuppress
            ? interaction.client.i18n.t('commands.embed.suppresses')
            : interaction.client.i18n.t('commands.embed.unsuppresses'),
          ephemeral: true,
        })
        break
      }
    }
  },
}
