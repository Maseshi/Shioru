const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stop playing current song")
		.setDescriptionLocalizations({ th: "หยุดเล่นเพลงปัจจุบัน" })
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
				interaction.client.i18n.t("commands.stop.no_queue"),
			);
		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.stop.not_owner"),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.stop.not_a_dj"),
				);
		}

		interaction.client.player.stop(interaction);
		await interaction.reply(interaction.client.i18n.t("commands.stop.stopped"));
	},
};
