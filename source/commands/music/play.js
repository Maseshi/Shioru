const {
	SlashCommandBuilder,
	ChannelType,
	PermissionFlagsBits,
	InteractionContextType,
} = require('discord.js');
const { YouTubePlugin, SearchResultType } = require('@distube/youtube');
const { SoundCloudPlugin, SearchType } = require('@distube/soundcloud');
const { catchError } = require('../../utils/consoleUtils');

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.Speak,
		PermissionFlagsBits.Connect,
	],
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('You can play-pause the music or sing along to it.')
		.setDescriptionLocalizations({ th: 'เล่น-หยุดเพลงก็ได้หรือร้องเพลงให้ฟัง' })
		.setDefaultMemberPermissions(PermissionFlagsBits.Connect)
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addStringOption((option) =>
			option
				.setName('song')
				.setDescription('You can search for songs by name, ID or link.')
				.setDescriptionLocalizations({
					th: 'คุณสามารถค้นหาเพลงตามชื่อ, ID, หรือลิงค์',
				})
				.setAutocomplete(true),
		)
		.addBooleanOption((option) =>
			option
				.setName('skip')
				.setDescription(
					'Immediately skip the currently playing song (if it exists) and play the added song.',
				)
				.setDescriptionLocalizations({
					th: 'ข้ามเพลงที่เล่นอยู่ทันที (หากมีอยู่) และเล่นเพลงที่เพิ่มมา',
				}),
		)
		.addIntegerOption((option) =>
			option
				.setName('position')
				.setDescription(
					'The position of the playlist to be inserted or added, starting from zero.',
				)
				.setDescriptionLocalizations({
					th: 'ตำแหน่งของเพลย์ลิสต์ที่ต้องการแทรกหรือเพิ่มโดยเริ่มต้นนับจากศูนย์',
				}),
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel that wants her to play music.')
				.setDescriptionLocalizations({ th: 'ช่องที่ต้องการให้เธอเล่นเพลง' })
				.addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice),
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();

		if (!focusedValue) return interaction.respond([]);

		const youtubePlugin = new YouTubePlugin();
		const soundCloudPlugin = new SoundCloudPlugin();

		const [youtubeResults, soundCloudResults] = await Promise.all([
			youtubePlugin.search(focusedValue, {
				type: SearchResultType.Video,
				limit: 10,
				safeSearch: true,
			}),
			soundCloudPlugin.search(focusedValue, SearchType.Track, 10),
		]);

		// Combine results by matching names, prefer SoundCloud source
		const soundCloudNames = new Set(
			soundCloudResults.map((result) => result.name.toLowerCase()),
		);
		const combined = [
			...soundCloudResults,
			...youtubeResults.filter(
				(result) => !soundCloudNames.has(result.name.toLowerCase()),
			),
		];

		if (!combined.length) return interaction.respond([]);

		await interaction.respond(
			combined.map((choice) => {
				const name =
					choice.name.length > 100
						? choice.name.slice(0, 97) + '...'
						: choice.name;
				const value = choice.url.length > 100 ? name : choice.url;
				return { name, value };
			}),
		);
	},
	async execute(interaction) {
		const inputSong = interaction.options.getString('song') ?? '';
		const inputSkip = interaction.options.getBoolean('skip') ?? false;
		const inputPosition = interaction.options.getInteger('position') ?? 0;
		const inputChannel = interaction.options.getChannel('channel') ?? '';

		const djs = interaction.client.configs.djs;
		const queue = interaction.client.player.getQueue(interaction);
		const voiceChannel = interaction.member.voice.channel;
		const meChannel = interaction.guild.members.me.voice.channel;

		if (!inputSong) {
			if (!queue)
				return await interaction.reply(
					interaction.client.i18n.t('commands.play.no_queue'),
				);
			if (queue.paused) {
				return interaction.client.commands
					.get('resume')
					.function.command.execute(interaction);
			} else {
				return interaction.client.commands
					.get('pause')
					.function.command.execute(interaction);
			}
		}
		if (!queue && (inputSkip || inputPosition))
			return await interaction.reply(
				interaction.client.i18n.t('commands.play.no_queue'),
			);
		if (queue && djs.enable) {
			if (
				interaction.user.id !== queue.songs[0].user.id &&
				queue.autoplay === false
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.play.currently_playing'),
				);
			if (
				djs.users.includes(interaction.user.id) &&
				djs.roles.includes(
					interaction.member.roles.cache.map((role) => role.id),
				) &&
				djs.only
			)
				return await interaction.reply(
					interaction.client.i18n.t('commands.play.not_a_dj'),
				);
		}
		if (!inputChannel && !voiceChannel && !meChannel)
			return await interaction.reply(
				interaction.client.i18n.t('commands.play.not_in_channel'),
			);

		try {
			await interaction.deferReply();
			await interaction.client.player.play(
				voiceChannel || inputChannel || meChannel,
				inputSong,
				{
					member: interaction.member,
					message: false,
					skip: inputSkip,
					position: inputPosition,
					textChannel: interaction.channel,
				},
			);
			await interaction.deleteReply();
		} catch (error) {
			if (error.message.includes('seconds'))
				return await interaction.reply(
					interaction.client.i18n.t('commands.play.can_not_connect'),
				);
			if (error.message.includes('non-NSFW'))
				return await interaction.reply(
					interaction.client.i18n.t('commands.play.can_not_play_in_non_nsfw'),
				);
			if (!queue && meChannel) {
				const connection = interaction.client.player.voices.get(meChannel);

				connection.leave();
			}

			catchError(
				interaction.client,
				interaction,
				module.exports.data.name,
				error,
			);
		}
	},
};
