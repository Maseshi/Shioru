const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageMessages,
  ],
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Let the bot print instead")
    .setDescriptionLocalizations({ th: "ปล่อยให้บอทพิมพ์แทน" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("send")
        .setDescription("Send message.")
        .setDescriptionLocalizations({ th: "ส่งข้อความ" })
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The message you want to send.")
            .setDescriptionLocalizations({ th: "ข้อความที่คุณต้องการส่ง" })
            .setRequired(true),
        )
        .addAttachmentOption((option) =>
          option
            .setName("attachment")
            .setDescription("Things to be attached to the message to be sent.")
            .setDescriptionLocalizations({
              th: "สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง",
            })
            .setRequired(false),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send the message to")
            .setDescriptionLocalizations({ th: "ช่องที่จะส่งข้อความ" })
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reply")
        .setDescription("Reply message.")
        .setDescriptionLocalizations({ th: "ส่งข้อความ" })
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the message you want to reply")
            .setDescriptionLocalizations({
              th: "ไอดีของข้อความที่ต้องการตอบกลับ",
            })
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The message you want to send.")
            .setDescriptionLocalizations({ th: "ข้อความที่คุณต้องการส่ง" })
            .setRequired(true),
        )
        .addAttachmentOption((option) =>
          option
            .setName("attachment")
            .setDescription("Things to be attached to the message to be sent.")
            .setDescriptionLocalizations({
              th: "สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง",
            })
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit the desired text.")
        .setDescriptionLocalizations({ th: "แก้ข้อความที่ต้องการ" })
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the message you want to edit")
            .setDescriptionLocalizations({
              th: "ไอดีของข้อความที่ต้องการแก้ไข",
            })
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The text you want to change")
            .setDescriptionLocalizations({
              th: "ข้อความที่คุณต้องการเปลี่ยนแปลง",
            })
            .setRequired(true),
        )
        .addAttachmentOption((option) =>
          option
            .setName("attachment")
            .setDescription("Things to be attached to the message to be sent.")
            .setDescriptionLocalizations({
              th: "สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง",
            })
            .setRequired(false),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const inputID = interaction.options.getString("id");
    const inputContent = interaction.options.getString("content");
    const inputAttachment =
      interaction.options.getAttachment("attachment") ?? null;
    const inputChannel = interaction.options.getChannel("channel") ?? null;

    switch (subcommand) {
      case "send":
        if (!inputChannel) {
          await interaction.channel.send({
            content: inputContent,
            files: inputAttachment ? [inputAttachment] : [],
          });
        } else {
          await inputChannel.send({
            content: inputContent,
            files: inputAttachment ? [inputAttachment] : [],
          });
        }

        await interaction.reply({
          content: inputChannel
            ? interaction.client.i18n.t("commands.message.sended_to_channel")
            : interaction.client.i18n.t("commands.message.sended"),
          ephemeral: true,
        });
        break;
      case "reply":
        try {
          const message = await interaction.channel.messages.fetch(inputID);

          if (!message)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                "commands.message.message_not_found",
              ),
              ephemeral: true,
            });

          await message.reply({
            content: inputContent,
            files: inputAttachment ? [inputAttachment] : [],
          });
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error,
          );
        }

        await interaction.reply({
          content: interaction.client.i18n.t("commands.message.replied"),
          ephemeral: true,
        });
        break;
      case "edit":
        try {
          const message = await interaction.channel.messages.fetch(inputID);

          if (!message)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                "commands.message.message_not_found",
              ),
              ephemeral: true,
            });
          if (!message.editable)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                "commands.message.can_not_edit",
              ),
              ephemeral: true,
            });

          await message.edit({
            content: inputContent,
            files: inputAttachment ? [inputAttachment] : [],
          });
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error,
          );
        }

        await interaction.reply({
          content: interaction.client.i18n.t("commands.message.edited"),
          ephemeral: true,
        });
        break;
    }
  },
};
