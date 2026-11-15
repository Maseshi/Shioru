const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

module.exports = {
  cooldown: 5,
  ephemeral: true,
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the ping and api latency of the bot.")
    .setDescriptionLocalizations({
      th: "ตรวจสอบความหน่วงและ API Latency ของเซิร์ฟเวอร์",
    })
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
    // Time only the API call so bot-side work before the reply is not counted.
    const sentAt = Date.now();
    await interaction.reply(interaction.client.i18n.t("commands.ping.waiting"));
    const roundtrip = Date.now() - sentAt;
    const websocket = interaction.client.ws.ping;

    const pingEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(interaction.client.i18n.t("commands.ping.connection"))
      .setDescription(
        interaction.client.i18n.t("commands.ping.info", {
          roundtrip_latency: roundtrip,
          websocket_latency: websocket,
        }),
      );

    await interaction.editReply({
      content: interaction.client.i18n.t("commands.ping.result"),
      embeds: [pingEmbed],
    });
  },
};
