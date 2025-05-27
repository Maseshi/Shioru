const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],
  data: new SlashCommandBuilder()
    .setName("donate")
    .setDescription(
      "Support me and my host to help with utilities bills by making a donation.",
    )
    .setDescriptionLocalizations({
      th: "สนับสนุนฉันและเจ้าบ้านเพื่อช่วยเหลือค่าน้ำค่าไฟด้วยการบริจาค",
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
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://github.com/sponsors/Maseshi")
        .setLabel("Github")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL("https://www.patreon.com/maseshi")
        .setLabel("Patreon")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL("https://www.buymeacoffee.com/maseshi")
        .setLabel("Buy me a green tea")
        .setStyle(ButtonStyle.Link),
    );

    await interaction.reply({
      content: interaction.client.i18n.t(
        "commands.donate.thank_you_in_advance",
      ),
      components: [row],
    });
  },
};
