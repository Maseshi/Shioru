const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");
const { fetchLevel, submitNotification } = require("../../utils/databaseUtils");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("exp")
		.setDescription("Manage experience within the server.")
		.setDescriptionLocalizations({ th: "จัดการค่าประสบการณ์ภายในเซิร์ฟเวอร์" })
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addSubcommand((subcommand) =>
			subcommand
				.setName("set")
				.setDescription("Set the members' experience.")
				.setDescriptionLocalizations({ th: "ตั้งค่าค่าประสบการณ์ของสมาชิก" })
				.addUserOption((option) =>
					option
						.setName("member")
						.setDescription(
							"The name of the member who wants to set the experience value.",
						)
						.setDescriptionLocalizations({
							th: "ชื่อของสมาชิกที่ต้องการกำหนดค่าประสบการณ์",
						})
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setName("amount")
						.setDescription("The amount of experience that you want to set.")
						.setDescriptionLocalizations({
							th: "จำนวนค่าประสบการณ์ที่คุณต้องการตั้งค่า",
						})
						.setRequired(true)
						.setMinValue(0),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const inputSetMember = interaction.options.getMember("member") ?? "";
		const inputSetAmount = interaction.options.getNumber("amount") ?? 0;

		switch (subcommand) {
			case "set": {
				const memberAvatar = inputSetMember.avatarURL();
				const memberUsername = inputSetMember.username;
				const setEXPEmbed = new EmbedBuilder()
					.setDescription(
						interaction.client.i18n
							.t("commands.exp.exp_was_changed")
							.replace("%s", memberUsername),
					)
					.setColor("Blue")
					.setThumbnail(memberAvatar)
					.setFooter({
						text: interaction.client.i18n.t("commands.exp.set_by_staff"),
					})
					.addFields([
						{
							name: interaction.client.i18n.t("commands.exp.level"),
							value: "```" + level + "```",
						},
						{
							name: interaction.client.i18n.t("commands.exp.experience"),
							value: "```" + exp + "```",
						},
					]);

				const data = await fetchLevel(interaction.client, interaction, "PUT", {
					member: inputSetMember,
					amount: inputSetAmount,
					type: "exp",
				});
				const exp = data.exp;
				const level = data.level;
				const status = data.status;

				if (status === "error")
					return await interaction.reply(
						interaction.client.i18n.t("commands.exp.error"),
					);

				const notified = await submitNotification(
					interaction.client,
					interaction.guild,
					"general",
					setEXPEmbed,
				);

				if (notified) {
					await interaction.reply(
						interaction.client.i18n.t("commands.exp.notification_complete"),
					);
				} else {
					await interaction.reply(
						interaction.client.i18n.t("commands.exp.success"),
					);
				}
				break;
			}
		}
	},
};
