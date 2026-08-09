const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const {
  getUserEphemeral,
  setUserEphemeral,
} = require("../../repositories/user");

module.exports = {
  ephemeral: "always",
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("ephemeral")
    .setDescription("Manage ephemeral responses for supported commands.")
    .setDescriptionLocalizations({
      th: "จัดการการตอบแบบ Ephemeral สำหรับคำสั่งที่รองรับ",
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
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("View your current ephemeral response setting.")
        .setDescriptionLocalizations({
          th: "ดูการตั้งค่าการตอบแบบ Ephemeral ของคุณ",
        }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Use ephemeral responses when a command supports it.")
        .setDescriptionLocalizations({
          th: "ใช้การตอบแบบ Ephemeral เมื่อคำสั่งรองรับ",
        }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription(
          "Use public responses unless a command is always ephemeral.",
        )
        .setDescriptionLocalizations({
          th: "ใช้การตอบสาธารณะ ยกเว้นคำสั่งที่เป็น Ephemeral เสมอ",
        }),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (subcommand === "get") {
      const enabled = await getUserEphemeral(userId);
      return await interaction.reply(
        interaction.client.i18n.t("commands.ephemeral.current", {
          status: interaction.client.i18n.t(
            enabled
              ? "commands.ephemeral.status_enabled"
              : "commands.ephemeral.status_disabled",
          ),
        }),
      );
    }

    const enabled = subcommand === "enable";
    await setUserEphemeral(userId, enabled);
    return await interaction.reply(
      interaction.client.i18n.t(
        enabled ? "commands.ephemeral.enabled" : "commands.ephemeral.disabled",
      ),
    );
  },
};
