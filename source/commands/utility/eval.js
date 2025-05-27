const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { Script } = require("node:vm");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate the Javascript code for testing.")
    .setDescriptionLocalizations({
      th: "ประเมินรหัส JavaScript สำหรับทดสอบผลการทำงาน",
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
    ])
    .addStringOption((option) =>
      option
        .setName("script")
        .setDescription("The Javascript code to be evaluated.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const inputScript = interaction.options.getString("script");

    const resultEmbed = new EmbedBuilder().setTitle(
      interaction.client.i18n.t("commands.eval.result"),
    );

    try {
      const script = new Script(inputScript);
      const result = script.runInNewContext();

      resultEmbed
        .setDescription(`\`\`\`JavaScript\n${result}\n\`\`\``)
        .setColor(Colors.Green);
    } catch (error) {
      resultEmbed
        .setDescription(`\`\`\`JavaScript\n${error.toString()}\n\`\`\``)
        .setColor(Colors.Red);
    }

    await interaction.reply({ embeds: [resultEmbed] });
  },
};
