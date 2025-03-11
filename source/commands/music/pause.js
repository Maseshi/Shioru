const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Temporarily stop playing songs in the queue.')
		.setDescriptionLocalizations({ th: 'หยุดเล่นเพลงในคิวชั่วคราว' })
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
				interaction.client.i18n.t('commands.pause.no_queue'),
			);
		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.pause.not_owner'),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.pause.not_a_dj'),
				);
		}
		if (queue.paused)
			return await interaction.reply(
				interaction.client.i18n.t('commands.pause.not_paused'),
			);

		interaction.client.player.pause(interaction);
		await interaction.reply(interaction.client.i18n.t('commands.pause.paused'));
	},
};
