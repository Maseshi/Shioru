const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { fetchLevel } = require("../../services/leveling");
const { submitNotification } = require("../../services/notification");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Manage levels within the server.")
    .setDescriptionLocalizations({ th: "จัดการเลเวลภายในเซิร์ฟเวอร์" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set Level of Members")
        .setDescriptionLocalizations({ th: "ตั้งค่าค่าประสบการณ์ของสมาชิก" })
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription(
              "The name of the member who wants to set the level value.",
            )
            .setDescriptionLocalizations({
              th: "ชื่อของสมาชิกที่ต้องการกำหนดค่าเลเวล",
            })
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of level that you want to set.")
            .setDescriptionLocalizations({
              th: "จำนวนเลเวลที่คุณต้องการตั้งค่า",
            })
            .setRequired(true)
            .setMinValue(0),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Removing EXP and Level of members")
        .setDescriptionLocalizations({ th: "ลบ exp และเลเวลของสมาชิก" })
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Members you want to delete levels.")
            .setDescriptionLocalizations({ th: "สมาชิกที่คุณต้องการลบระดับ" })
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const inputMember = interaction.options.getMember("member") ?? "";
    const inputAmount = interaction.options.getNumber("amount") ?? 0;

    switch (subcommand) {
      case "set": {
        const memberAvatar = inputMember.avatarURL();
        const memberUsername = inputMember.username;
        const data = await fetchLevel(interaction.client, interaction, "PUT", {
          member: inputMember,
          amount: inputAmount,
          type: "level",
        });
        const { exp, level, status } = data;

        if (status === "error")
          return await interaction.reply(
            interaction.client.i18n.t("commands.level.set_error"),
          );

        const setLevelEmbed = new EmbedBuilder()
          .setDescription(
            interaction.client.i18n.t("commands.level.level_was_changed", {
              memberName: memberUsername,
            }),
          )
          .setColor("Blue")
          .setThumbnail(memberAvatar)
          .setFooter({
            text: interaction.client.i18n.t("commands.level.set_by_staff"),
          })
          .addFields([
            {
              name: interaction.client.i18n.t("commands.level.level"),
              value: "```" + level + "```",
            },
            {
              name: interaction.client.i18n.t("commands.level.experience"),
              value: "```" + exp + "```",
            },
          ]);

        const notified = submitNotification(
          interaction.client,
          interaction.guild,
          "general",
          setLevelEmbed,
        );

        if (notified) {
          await interaction.reply(
            interaction.client.i18n.t("commands.level.notification_complete"),
          );
        } else {
          await interaction.reply(
            interaction.client.i18n.t("commands.level.set_success"),
          );
        }
        break;
      }
      case "delete": {
        await interaction.reply(
          interaction.client.i18n.t("commands.level.deleting"),
        );

        const data = await fetchLevel(
          interaction.client,
          interaction,
          "DELETE",
          { member: inputMember },
        );
        const status = data.status;

        if (status === "missing")
          return await interaction.editReply(
            interaction.client.i18n.t("commands.level.user_current_no_level"),
          );
        if (status === "success")
          return await interaction.editReply(
            interaction.client.i18n.t("commands.level.delete_success"),
          );
        if (status === "error")
          return await interaction.editReply(
            interaction.client.i18n.t("commands.level.delete_error"),
          );
        break;
      }
    }
  },
};
