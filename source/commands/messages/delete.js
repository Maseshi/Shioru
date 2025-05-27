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
    .setName("delete")
    .setDescription("Delete unwanted messages")
    .setDescriptionLocalizations({ th: "ลบข้อความที่ไม่ต้องการ" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID of the message you want to delete")
        .setDescriptionLocalizations({ th: "ไอดีของข้อความที่ต้องการลบ" })
        .setRequired(true),
    ),
  async execute(interaction) {
    const inputID = interaction.options.getString("id");

    try {
      const message = await interaction.channel.messages.fetch(inputID);

      if (!message)
        return await interaction.reply({
          content: interaction.client.i18n.t(
            "commands.delete.message_not_found",
          ),
          ephemeral: true,
        });
      if (!message.deleteable)
        return await interaction.reply({
          content: interaction.client.i18n.t("commands.delete.can_not_delete"),
          ephemeral: true,
        });

      await message.delete();
    } catch (error) {
      catchError(
        interaction.client,
        interaction,
        module.exports.data.name,
        error,
      );
    }

    await interaction.reply({
      content: interaction.client.i18n.t("commands.delete.deleted"),
      ephemeral: true,
    });
  },
};
