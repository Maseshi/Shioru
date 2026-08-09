const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { getGuildData } = require("../../utils/cacheUtils");
const { updateCaptcha } = require("../../repositories/guildSettings");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ModerateMembers,
  ],
  data: new SlashCommandBuilder()
    .setName("captcha")
    .setDescription("Setup the captcha verification system.")
    .setDescriptionLocalizations({ th: "ตั้งค่าระบบตรวจสอบ captcha" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Set up the Captcha system")
        .setDescriptionLocalizations({ th: "ตั้งค่าระบบ Captcha" })
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role or rank when confirmed.")
            .setDescriptionLocalizations({
              th: "บทบาทหรือยศเมื่อผ่านการยืนยัน",
            })
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("captcha")
            .setDescription("The name you want the captcha to generate.")
            .setDescriptionLocalizations({
              th: "ชื่อที่คุณต้องการให้ captcha สร้างขึ้นมา",
            })
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable the captcha system.")
        .setDescriptionLocalizations({ th: "เปิดใช้งานระบบ captcha" }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the captcha system.")
        .setDescriptionLocalizations({ th: "ปิดใช้งานระบบ captcha" }),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const inputRole = interaction.options.getRole("role") ?? "";
    const inputCaptcha = interaction.options.getString("captcha") ?? "";

    const captchaData = getGuildData(
      interaction.client,
      interaction.guild.id,
    )?.captcha;

    switch (subcommand) {
      case "setup":
        await updateCaptcha(interaction.guild.id, {
          enable: true,
          role: inputRole.id,
          text: inputCaptcha,
        });

        await interaction.reply(
          interaction.client.i18n.t("commands.captcha.captcha_setup_success"),
        );
        break;
      case "enable":
        if (!captchaData)
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.need_to_setup_before"),
          );
        if (captchaData.enable)
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.currently_enable"),
          );

        await updateCaptcha(interaction.guild.id, { enable: true });
        await interaction.reply(
          interaction.client.i18n.t("commands.captcha.enabled_captcha"),
        );
        break;
      case "disable":
        if (!captchaData)
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.need_to_setup_before"),
          );
        if (!captchaData.enable)
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.currently_disable"),
          );

        await updateCaptcha(interaction.guild.id, { enable: false });
        await interaction.reply(
          interaction.client.i18n.t("commands.captcha.disabled_captcha"),
        );
        break;
    }
  },
};
