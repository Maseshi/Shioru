const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("tableflip")
		.setDescription("(\\\\°□°)\\\\  ┬─┬")
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		]),
	async execute(interaction) {
		const frames = [
			"(-°□°)-  ┬─┬",
			"(╯°□°)╯    ]",
			"(╯°□°)╯  ︵  ┻━┻",
			"(╯°□°)╯       [",
			"(╯°□°)╯           ┬─┬",
		];

		await interaction.reply("(\\\\°□°)\\\\  ┬─┬");

		for (const frame of frames) {
			setTimeout(async () => {
				await interaction.editReply(frame);
			}, 1000);
		}
	},
};
