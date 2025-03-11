const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect],
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the audio channel.')
		.setDescriptionLocalizations({ th: 'เข้าร่วมช่องสัญญาณเสียง' })
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription(
					'The channel you want the bot to participate in advance.',
				)
				.setDescriptionLocalizations({
					th: 'ช่องที่คุณต้องการให้บอทเข้าร่วมล่วงหน้า',
				})
				.setRequired(false)
				.addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice),
		),
	async execute(interaction) {
		const inputChannel = interaction.options.getChannel('channel') ?? '';

		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);

		if (queue && djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.join.another_player_is_playing'),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.join.not_a_dj'),
				);
		}
		if (!inputChannel) {
			const voiceChannel = interaction.member.voice.channel;
			const meChannel = interaction.guild.members.me.voice.channel;

			if (!voiceChannel)
				return await interaction.reply(
					interaction.client.i18n.t('commands.join.not_in_channel'),
				);
			if (meChannel && meChannel.id === voiceChannel.id)
				return await interaction.reply(
					interaction.client.i18n.t('commands.join.already_joined'),
				);

			interaction.client.player.voices.join(voiceChannel);
			await interaction.reply(
				interaction.client.i18n
					.t('commands.join.joined')
					.replace('%s', voiceChannel.id),
			);
		} else {
			interaction.client.player.voices.join(inputChannel);
			await interaction.reply(
				interaction.client.i18n
					.t('commands.join.channel_joined')
					.replace('%s', inputChannel.id),
			);
		}
	},
};
