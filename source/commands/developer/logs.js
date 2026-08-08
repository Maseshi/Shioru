const {
  SlashCommandBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  MessageFlags,
} = require("discord.js");
const { existsSync, statSync, unlinkSync } = require("node:fs");
const { basename } = require("node:path");
const {
  findLogFile,
  formatLogDate,
  listLogFiles,
} = require("../../utils/logUtils");

const addTypeOption = (subcommand) =>
  subcommand.addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Log type")
      .setDescriptionLocalizations({ th: "ประเภทของล็อก" })
      .setRequired(true)
      .setChoices(
        { name: "Application", value: "app" },
        { name: "Errors", value: "error" },
      ),
  );

const addDateOption = (subcommand) =>
  subcommand.addStringOption((option) =>
    option
      .setName("date")
      .setDescription("Date in YYYY-MM-DD format (defaults to today)")
      .setDescriptionLocalizations({
        th: "วันที่รูปแบบ YYYY-MM-DD (ค่าเริ่มต้นคือวันนี้)",
      })
      .setMinLength(10)
      .setMaxLength(10),
  );

const privateReply = (interaction, payload) =>
  interaction.reply(
    typeof payload === "string"
      ? { content: payload, flags: MessageFlags.Ephemeral }
      : { ...payload, flags: MessageFlags.Ephemeral },
  );

const canManageLogs = (interaction) => {
  const owner = interaction.client.configs.team.owner;
  const developers = interaction.client.configs.team.developer ?? [];
  return (
    interaction.user.id === owner || developers.includes(interaction.user.id)
  );
};

const resolveRequestedLog = (interaction) => {
  const type = interaction.options.getString("type");
  const date = interaction.options.getString("date") ?? formatLogDate();
  return findLogFile(type, date)?.path ?? null;
};

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("List, download, or delete daily application logs.")
    .setDescriptionLocalizations({
      th: "ดู ดาวน์โหลด หรือลบล็อกรายวันของแอปพลิเคชัน",
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
        .setName("list")
        .setDescription("List available daily log files.")
        .setDescriptionLocalizations({ th: "แสดงรายการไฟล์ล็อกรายวัน" }),
    )
    .addSubcommand((subcommand) =>
      addDateOption(
        addTypeOption(
          subcommand
            .setName("get")
            .setDescription("Download a daily log file.")
            .setDescriptionLocalizations({ th: "ดาวน์โหลดไฟล์ล็อกรายวัน" }),
        ),
      ),
    )
    .addSubcommand((subcommand) =>
      addDateOption(
        addTypeOption(
          subcommand
            .setName("delete")
            .setDescription("Delete a daily log file.")
            .setDescriptionLocalizations({ th: "ลบไฟล์ล็อกรายวัน" }),
        ),
      ),
    ),
  async execute(interaction) {
    if (!canManageLogs(interaction))
      return await privateReply(
        interaction,
        interaction.client.i18n.t("commands.logs.only_owner_and_developers"),
      );

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "list") {
      const files = listLogFiles();
      if (!files.length)
        return await privateReply(
          interaction,
          interaction.client.i18n.t("commands.logs.empty_directory"),
        );

      const entries = files
        .slice(0, 25)
        .map((file) => `${file.name} (${Math.ceil(file.size / 1024)} KB)`)
        .join("\n");
      return await privateReply(interaction, `\`\`\`text\n${entries}\n\`\`\``);
    }

    const file = resolveRequestedLog(interaction);
    if (!file || !existsSync(file))
      return await privateReply(
        interaction,
        interaction.client.i18n.t("commands.logs.file_missing"),
      );

    if (subcommand === "get") {
      if (statSync(file).size === 0)
        return await privateReply(
          interaction,
          interaction.client.i18n.t("commands.logs.empty_content"),
        );

      const attachment = new AttachmentBuilder(file, {
        description: interaction.client.i18n.t(
          "commands.logs.attachment_description",
        ),
      });
      return await privateReply(interaction, {
        content: interaction.client.i18n.t("commands.logs.found_file"),
        files: [attachment],
      });
    }

    unlinkSync(file);
    return await privateReply(
      interaction,
      interaction.client.i18n
        .t("commands.logs.file_has_been_deleted")
        .replace("%s", basename(file)),
    );
  },
};
