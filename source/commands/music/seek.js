const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Change the duration of the currently playing song')
		.setDescriptionLocalizations({
			th: 'เปลี่ยนระยะเวลาของเพลงที่กำลังเล่นอยู่',
		})
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.setIntegrationTypes([
			ApplicationIntegrationType.GuildInstall,
			ApplicationIntegrationType.UserInstall,
		])
		.addIntegerOption((option) =>
			option
				.setName('second')
				.setDescription('The time in seconds that you want to seek.')
				.setDescriptionLocalizations({
					th: 'เวลาเป็นวินาทีที่คุณต้องการเปลี่ยนช่วง',
				})
				.setRequired(true)
				.setMinValue(0),
		),
	async execute(interaction) {
		const inputSecond = interaction.options.getInteger('second');

		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);

		if (!queue)
			return await interaction.reply(
				interaction.client.i18n.t('commands.seek.no_queue'),
			);

		const queueDuration = queue.songs.map((song) => song.duration);
		const queueFormatDuration = queue.songs.map((song) => song.formatDuration);

		if (djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.seek.not_owner'),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.seek.not_a_dj'),
				);
		}
		if (!inputSecond)
			return await interaction.reply(
				interaction.client.i18n
					.t('commands.seek.seek_guide')
					.replace('%s', queueDuration),
			);
		if (inputSecond >= parseInt(queueDuration.join()))
			return await interaction.reply(
				interaction.client.i18n
					.t('commands.seek.too_much')
					.replace('%s', queueFormatDuration),
			);

		interaction.client.player.seek(interaction, inputSecond);
		await interaction.reply(interaction.client.i18n.t('commands.seek.sought'));
	},
};
