const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Adjust the music volume")
		.setDescriptionLocalizations({ th: "ปรับระดับเสียงเพลง" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addIntegerOption((option) =>
			option
				.setName("percent")
				.setDescription("Adjust the volume of the music from 0 to 100.")
				.setDescriptionLocalizations({
					th: "ปรับระดับเสียงของเพลงจาก 0 ถึง 100",
				})
				.setMinValue(0)
				.setMaxValue(100)
				.setRequired(false),
		),
	async execute(interaction) {
		const inputPercent = interaction.options.getInteger("percent") ?? 0;

		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);

		if (!queue)
			return await interaction.reply(
				interaction.client.i18n.t("commands.volume.no_queue"),
			);

		const queueVolume = queue.volume;

		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.volume.not_owner"),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t("commands.volume.not_a_dj"),
				);
		}
		if (!inputPercent)
			return await interaction.reply(
				interaction.client.i18n
					.t("commands.volume.this_volume")
					.replace("%s", queueVolume),
			);

		interaction.client.player.setVolume(interaction, inputPercent);
		await interaction.reply(
			interaction.client.i18n
				.t("commands.volume.adjusted")
				.replace("%s", inputPercent),
		);
	},
};
