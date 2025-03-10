const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("timezone")
		.setDescription("Convert time zones as desired.")
		.setDescriptionLocalizations({ th: "แปลงเขตเวลาตามที่ต้องการ" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addSubcommand((subcommand) =>
			subcommand
				.setName("now")
				.setDescription("Get the current time for the desired time zone.")
				.setDescriptionLocalizations({
					th: "รับเวลาปัจจุบันตามเขตเวลาที่ต้องการ",
				})
				.addStringOption((option) =>
					option
						.setName("locale")
						.setDescription(
							"The code of the location for which the time zone is to be converted, such as en-US",
						)
						.setDescriptionLocalizations({
							th: "รหัสของสถานที่ที่ต้องการแปลงเขตเวลา เช่น th-TH",
						})
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("convert")
				.setDescription("Convert the desired time zone to another time zone.")
				.setDescriptionLocalizations({
					th: "แปลงเขตเวลาที่ต้องการเป็นเขตเวลาอื่น",
				})
				.addStringOption((option) =>
					option
						.setName("time")
						.setDescription("Time to convert")
						.setDescriptionLocalizations({ th: "เวลาที่ต้องการแปลง" })
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("locale")
						.setDescription(
							"The code of the location for which the time zone is to be converted, such as en-US",
						)
						.setDescriptionLocalizations({
							th: "รหัสของสถานที่ที่ต้องการแปลงเขตเวลา เช่น th-TH",
						})
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const inputTime = interaction.options.getString("time") ?? "";
		const inputLocale = interaction.options.getString("locale");

		switch (subcommand) {
			case "now": {
				try {
					const date = new Date().toLocaleString(inputLocale);

					await interaction.reply(
						interaction.client.i18n.t("commands.timezone.this_timezone", {
							locale: inputLocale,
							time: date,
						}),
					);
				} catch {
					await interaction.reply(
						interaction.client.i18n.t(
							"commands.timezone.can_not_convert_timezone",
						),
					);
				}
				break;
			}
			case "convert": {
				try {
					const date = new Date(inputTime).toLocaleString(inputLocale);

					await interaction.reply(
						interaction.client.i18n.t("commands.timezone.time_at_timezone", {
							locale: inputLocale,
							time: date,
						}),
					);
				} catch {
					await interaction.reply(
						interaction.client.i18n.t(
							"commands.timezone.can_not_convert_timezone",
						),
					);
				}
				break;
			}
		}
	},
};
