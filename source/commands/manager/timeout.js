const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ModerateMembers,
  ],
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Set a time limit for members before they leave the guild.")
    .setDescriptionLocalizations({ th: "กำหนดเวลาให้สมาชิกก่อนออกจากกิลด์" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Set a timeout for the user.")
        .setDescriptionLocalizations({ th: "ตั้งให้ผู้ใช้หมดเวลา" })
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Users who want to set a timeout.")
            .setDescriptionLocalizations({
              th: "ผู้ใช้ที่ต้องการตั้งให้หมดเวลา",
            })
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("The length of time the user will be kicked out.")
            .setDescriptionLocalizations({ th: "ระยะเวลาที่ผู้ใช้จะถูกเตะออก" })
            .setRequired(true)
            .addChoices(
              { name: "60 Seconds", value: "60" },
              { name: "2 Minutes", value: "120" },
              { name: "5 Minutes", value: "300" },
              { name: "10 Minutes", value: "600" },
              { name: "15 Minutes", value: "900" },
              { name: "20 Minutes", value: "1200" },
              { name: "30 Minutes", value: "1800" },
              { name: "45 Minutes", value: "2700" },
              { name: "1 Hour", value: "3600" },
              { name: "2 Hours", value: "7200" },
              { name: "3 Hours", value: "10800" },
              { name: "5 Hours", value: "18000" },
              { name: "10 Hours", value: "36000" },
              { name: "1 Day", value: "86400" },
              { name: "2 Days", value: "172800" },
              { name: "3 Days", value: "259200" },
              { name: "5 Days", value: "43200" },
              { name: "1 Week", value: "604800" },
            ),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason the user was set to time out.")
            .setDescriptionLocalizations({
              th: "เหตุผลที่ตั้งให้ผู้ใช้หมดเวลา",
            }),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Set a untimeout for the user.")
        .setDescriptionLocalizations({ th: "ตั้งให้ผู้ใช้ไม่หมดเวลา" })
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Users who want to set a untimeout.")
            .setDescriptionLocalizations({
              th: "ผู้ใช้ที่ต้องการตั้งให้ไม่หมดเวลา",
            })
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason the user was set to untimeout.")
            .setDescriptionLocalizations({
              th: "เหตุผลที่ตั้งให้ผู้ใช้ไม่หมดเวลา",
            }),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const inputUser = interaction.options.getUser("user");
    const inputDuration = interaction.options.getString("duration");
    const inputReason =
      interaction.options.getString("reason") ??
      interaction.client.i18n.t("commands.timeout.no_reason");

    const member = await interaction.guild.members.fetch(inputUser.id);

    if (!member)
      return await interaction.reply(
        interaction.client.i18n.t("commands.timeout.member_not_found"),
      );
    if (!member.kickable)
      return await interaction.reply(
        interaction.client.i18n.t("commands.timeout.can_not_set"),
      );
    if (interaction.member.id === member.id)
      return await interaction.reply(
        interaction.client.i18n.t("commands.timeout.can_not_set_for_yourself"),
      );
    if (member.permissions.has(PermissionFlagsBits.Administrator))
      return await interaction.reply(
        interaction.client.i18n.t("commands.timeout.can_not_set_to_admin"),
      );

    switch (subcommand) {
      case "add": {
        await member.timeout(inputDuration * 1000, inputReason);
        await member.send(
          interaction.client.i18n.t("commands.timeout.timeout_dm_to_user", {
            guild: interaction.guild.name,
            reason: inputReason,
          }),
        );
        await interaction.reply(
          interaction.client.i18n.t("commands.timeout.success_timeout", {
            user: member.tag,
            time: inputDuration / 60,
            reason: inputReason,
          }),
        );
        break;
      }
      case "remove": {
        await member.timeout(null, inputReason);
        await member.send(
          interaction.client.i18n.t("commands.timeout.untimeout_dm_to_user", {
            guild: interaction.guild.name,
            reason: inputReason,
          }),
        );
        await interaction.reply(
          interaction.client.i18n.t("commands.timeout.success_untimeout", {
            user: member.tag,
            reason: inputReason,
          }),
        );
        break;
      }
    }
  },
};
