const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffle queue')
		.setDescriptionLocalizations({ th: 'สับเปลี่ยนในคิว' })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.setIntegrationTypes([
			ApplicationIntegrationType.GuildInstall,
			ApplicationIntegrationType.UserInstall,
		]),
	async execute(interaction) {
		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);

		if (!queue)
			return await interaction.reply(
				interaction.client.i18n.t('commands.shuffle.no_queue'),
			);
		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.shuffle.not_owner'),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.shuffle.not_a_dj'),
				);
		}

		interaction.client.player.shuffle(interaction);
		await interaction.reply(
			interaction.client.i18n.t('commands.shuffle.now_shuffle'),
		);
	},
};
