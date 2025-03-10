const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("emojify")
		.setDescription("Convert text to emoji text")
		.setDescriptionLocalizations({ th: "แปลงข้อความเป็นข้อความอีโมจิ" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addStringOption((option) =>
			option
				.setName("text")
				.setDescription("The text you want to convert to emoji text.")
				.setDescriptionLocalizations({
					th: "ข้อความที่ต้องการแปลงเป็นข้อความอีโมจิ",
				})
				.setMaxLength(2000)
				.setMinLength(1)
				.setRequired(true),
		)
		.addBooleanOption((option) =>
			option
				.setName("hidden")
				.setDescription("Want to hide emoji text?")
				.setDescriptionLocalizations({ th: "ต้องการซ่อนข้อความอิโมจิหรือไม่" }),
		),
	async execute(interaction) {
		const inputText = interaction.options.getString("text");
		const inputHidden = interaction.options.getBoolean("hidden");

		try {
			const emojiText = inputText
				.toLowerCase()
				.split("")
				.map((letter) =>
					letter === " " ? " " : `:regional_indicator_${letter}:`,
				)
				.join("");

			await interaction.reply({ content: emojiText, ephemeral: inputHidden });
		} catch (error) {
			await interaction.reply({
				content: interaction.client.i18n.t("commands.emojify.can_not_convert"),
				ephemeral: inputHidden,
			});
		}
	},
};
