const {
	SlashCommandBuilder,
	EmbedBuilder,
	Colors,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");
const { getDatabase, ref, child, push } = require("firebase/database");
const { webhookSend } = require("../../utils/clientUtils");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("issues")
		.setDescription("Report issue information about bots.")
		.setDescriptionLocalizations({ th: "รายงานข้อผิดพลาดเกี่ยวกับบอท" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addSubcommand((subcommand) =>
			subcommand
				.setName("bug")
				.setDescription("Create a report to help us improve")
				.setDescriptionLocalizations({ th: "สร้างรายงานเพื่อช่วยเราปรับปรุง" })
				.addStringOption((option) =>
					option
						.setName("title")
						.setDescription("Topic of the problem encountered")
						.setDescriptionLocalizations({ th: "หัวข้อของปัญหาที่พบ" })
						.setRequired(true)
						.setMinLength(5),
				)
				.addStringOption((option) =>
					option
						.setName("description")
						.setDescription("Description of encountered problems")
						.setDescriptionLocalizations({ th: "คำอธิบายเกี่ยวกับปัญหาที่พบ" })
						.setRequired(false)
						.setMinLength(5),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("feature")
				.setDescription("Suggest an idea for this project")
				.setDescriptionLocalizations({ th: "เสนอแนวคิดสำหรับโครงการนี้" })
				.addStringOption((option) =>
					option
						.setName("title")
						.setDescription("Topic I would like to propose")
						.setDescriptionLocalizations({ th: "หัวข้อที่อยากจะเสนอ" })
						.setRequired(true)
						.setMinLength(5),
				)
				.addStringOption((option) =>
					option
						.setName("description")
						.setDescription("Description of feedback")
						.setDescriptionLocalizations({ th: "คำอธิบายของข้อเสนอแนะ" })
						.setRequired(false)
						.setMinLength(5),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const inputTitle = interaction.options.getString("title");
		const inputDescription = interaction.options.getString("description") ?? "";

		const issuesRef = ref(getDatabase(), "issues");

		const authorUid = interaction.user.id;
		const authorTag = interaction.user.tag;
		const date = new Date();
		const webhookLogEmbed = new EmbedBuilder()
			.setTimestamp()
			.setTitle("🛟・Issues");

		switch (subcommand) {
			case "bug": {
				await interaction.reply(
					interaction.client.i18n.t("commands.issues.bug_sending"),
				);
				webhookLogEmbed
					.setColor(Colors.Red)
					.setDescription(
						"The following bug was reported by %user.".replace(
							"%user",
							authorTag,
						),
					)
					.setFields([
						{ name: "🏷️ Title", value: inputTitle, inline: true },
						{
							name: "📄 Description",
							value: inputDescription || "None",
							inline: true,
						},
					]);
				webhookSend(interaction.client.configs.logger.issues, {
					embeds: [webhookLogEmbed],
				});
				await push(child(issuesRef, "bugs"), {
					title: inputTitle,
					description: inputDescription,
					user: authorTag,
					uid: authorUid,
					reportedAt: date,
					status: { read: false, close: false, comment: false },
				});
				await interaction.editReply(
					interaction.client.i18n.t("commands.issues.bug_success"),
				);
				break;
			}
			case "feature": {
				await interaction.reply(
					interaction.client.i18n.t("commands.issues.feature_sending"),
				);
				webhookLogEmbed
					.setColor(Colors.Blue)
					.setDescription(
						"A new feature was requested from %user.".replace(
							"%user",
							authorTag,
						),
					)
					.setFields([
						{
							name: "🕒 Timestamp",
							value: date.toLocaleString(),
							inline: true,
						},
						{ name: "🏷️ Title", value: inputTitle, inline: true },
						{
							name: "📄 Description",
							value: inputDescription || "None",
							inline: true,
						},
					]);
				webhookSend(interaction.client.configs.logger.issues, {
					embeds: [webhookLogEmbed],
				});
				await push(child(issuesRef, "features"), {
					title: inputTitle,
					description: inputDescription,
					user: authorTag,
					uid: authorUid,
					reportedAt: date,
					status: { read: false, close: false, comment: false },
				});

				await interaction.editReply(
					interaction.client.i18n.t("commands.issues.feature_success"),
				);
				break;
			}
		}
	},
};
