const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("related")
		.setDescription("Songs related to the currently playing song")
		.setDescriptionLocalizations({ th: "เพลงที่เกี่ยวข้องกับเพลงที่เล่นอยู่" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addSubcommand((option) =>
			option
				.setName("add")
				.setDescription("Add related songs to the queue.")
				.setDescriptionLocalizations({ th: "เพิ่มเพลงที่เกี่ยวข้องลงในคิว." }),
		),
	async execute(interaction) {
		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);

		if (!queue)
			return await interaction.reply(
				interaction.client.i18n.t("commands.related.no_queue"),
			);
		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.related.not_queue_owner"),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.related.not_a_dj"),
				);
		}

		const relatedSong = await interaction.client.player.addRelatedSong(
			interaction.guild,
		);

		await interaction.reply(
			interaction.client.i18n.t("commands.related.added_related_song", {
				name: relatedSong.name,
				duration: relatedSong.formattedDuration,
			}),
		);
	},
};
