const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the currently playing song.')
		.setDescriptionLocalizations({ th: 'ข้ามเพลงที่กำลังเล่นอยู่' })
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
				interaction.client.i18n.t('commands.skip.no_queue'),
			);
		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.skip.not_owner'),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.skip.not_a_dj'),
				);
		}

		interaction.client.player.skip(interaction);
		await interaction.reply(interaction.client.i18n.t('commands.skip.skipped'));
	},
};
