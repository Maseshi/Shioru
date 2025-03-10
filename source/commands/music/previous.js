const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("previous")
		.setDescription("Return to the previous song.")
		.setDescriptionLocalizations({ th: "กลับไปยังเพลงก่อนหน้านี้" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		]),
	async execute(interaction) {
		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);

		if (!queue)
			return await interaction.reply(
				interaction.client.i18n.t("commands.previous.no_queue"),
			);
		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.previous.not_owner"),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.previous.not_a_dj"),
				);
		}
		if (!queue.previousSongs)
			return await interaction.reply(
				interaction.client.i18n.t("commands.previous.no_previous_song_queue"),
			);

		interaction.client.player.previous(interaction);
		await interaction.reply(
			interaction.client.i18n.t("commands.previous.previous"),
		);
	},
};
