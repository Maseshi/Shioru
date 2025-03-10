const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { getDatabase, ref, child, get, update } = require("firebase/database");

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

    const guildRef = child(ref(getDatabase(), "guilds"), interaction.guild.id);
    const guildSnapshot = await get(guildRef);
    const guildData = guildSnapshot.val();

    switch (subcommand) {
      case "setup":
        await update(child(guildRef, "captcha"), {
          enable: true,
          role: inputRole.id,
          text: inputCaptcha,
        });

        await interaction.reply(
          interaction.client.i18n.t("commands.captcha.captcha_setup_success"),
        );
        break;
      case "enable":
        if (!guildSnapshot.exists())
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.need_to_setup_before"),
          );
        if (guildData.enable)
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.currently_enable"),
          );

        await update(child(guildRef, "captcha"), { enable: true });
        await interaction.reply(
          interaction.client.i18n.t("commands.captcha.enabled_captcha"),
        );
        break;
      case "disable":
        if (!guildSnapshot.exists())
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.need_to_setup_before"),
          );
        if (!guildData.enable)
          return await interaction.reply(
            interaction.client.i18n.t("commands.captcha.currently_disable"),
          );

        await update(child(guildRef, "captcha"), { enable: false });
        await interaction.reply(
          interaction.client.i18n.t("commands.captcha.disabled_captcha"),
        );
        break;
    }
  },
};
