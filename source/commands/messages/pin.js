const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageMessages,
  ],
  data: new SlashCommandBuilder()
    .setName("pin")
    .setDescription("Manage message pinning")
    .setDescriptionLocalizations({ th: "จัดการการปักหมุดข้อความ" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Pin the desired message")
        .setDescriptionLocalizations({ th: "ปักหมุดข้อความที่ต้องการ" })
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the message you want to edit")
            .setDescriptionLocalizations({
              th: "ไอดีของข้อความที่ต้องการปักหมุด",
            })
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for pinning the message")
            .setDescriptionLocalizations({ th: "เหตุผลที่ปักหมุดข้อความ" })
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Unpin pinned messages")
        .setDescriptionLocalizations({ th: "เลิกปักหมุดข้อความที่ปักหมุด" })
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the message you want to unpin")
            .setDescriptionLocalizations({
              th: "ไอดีของข้อความที่ต้องการปักหมุด",
            })
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for unpinning messages")
            .setDescriptionLocalizations({ th: "เหตุผลที่เลิกปักหมุดข้อความ" })
            .setRequired(false),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const inputID = interaction.options.getString("id");
    const inputReason = interaction.options.getString("reason") ?? "";

    switch (subcommand) {
      case "add": {
        try {
          const message = await interaction.channel.messages.fetch(inputID);

          if (!message)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                "commands.pin.message_not_found",
              ),
              ephemeral: true,
            });
          if (!message.pinnable)
            return await interaction.reply({
              content: interaction.client.i18n.t("commands.pin.can_not_pin"),
              ephemeral: true,
            });

          await message.pin({ reason: inputReason });
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error,
          );
        }

        await interaction.reply({
          content: interaction.client.i18n.t("commands.pin.pinned"),
          ephemeral: true,
        });
        break;
      }
      case "remove": {
        try {
          const message = await interaction.channel.messages.fetchPinned(
            (messages) => messages.id === inputID,
          );

          if (!message)
            return await interaction.reply({
              content: interaction.client.i18n.t(
                "commands.pin.message_not_found",
              ),
              ephemeral: true,
            });
          if (!message.pinned)
            return await interaction.reply({
              content: interaction.client.i18n.t("commands.pin.is_not_pinned"),
              ephemeral: true,
            });

          await message.unpin({ reason: inputReason });
        } catch (error) {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error,
          );
        }

        await interaction.reply({
          content: interaction.client.i18n.t("commands.pin.unpinned"),
          ephemeral: true,
        });
        break;
      }
    }
  },
};
