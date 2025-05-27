const {
  SlashCommandBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.AttachFiles,
  ],
  data: new SlashCommandBuilder()
    .setName("rip")
    .setDescription("Send RIP images")
    .setDescriptionLocalizations({ th: "ส่งภาพ RIP" })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ]),
  async execute(interaction) {
    const rip = new AttachmentBuilder("https://i.imgur.com/w3duR07.png");

    if (!rip)
      return await interaction.reply(
        interaction.client.i18n.t("commands.rip.no_image"),
      );

    await interaction.reply({ files: [rip] });
  },
};
