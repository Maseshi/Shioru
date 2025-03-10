const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("jump")
		.setDescription("Skip to the selected queue number")
		.setDescriptionLocalizations({ th: "ข้ามไปยังหมายเลขคิวที่เลือก" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addIntegerOption((option) =>
			option
				.setName("number")
				.setDescription("Number of songs to skip.")
				.setDescriptionLocalizations({ th: "หมายเลขของเพลงที่จะข้ามไป" })
				.setRequired(true)
				.setMinValue(1),
		),
	async execute(interaction) {
		const inputAmount = interaction.options.getInteger("number");

		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);

		if (!queue)
			return await interaction.reply(
				interaction.client.i18n.t("commands.jump.no_queue"),
			);
		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.jump.not_queue_owner"),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.jump.not_a_dj"),
				);
		}

		if (inputAmount > queue.songs.length)
			return await interaction.reply(
				interaction.client.i18n.t("commands.jump.too_much"),
			);

		try {
			interaction.client.player.jump(interaction, inputAmount);
			await interaction.reply(
				interaction.client.i18n
					.t("commands.jump.jumped")
					.replace("%s", inputAmount),
			);
		} catch (error) {
			await interaction.reply(
				interaction.client.i18n.t("commands.jump.can_not_jump"),
			);
		}
	},
};
