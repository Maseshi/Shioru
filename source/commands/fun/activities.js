const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChannelType,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.UseEmbeddedActivities,
	],
	data: new SlashCommandBuilder()
		.setName('activities')
		.setDescription('Run activities through the audio channel')
		.setDescriptionLocalizations({ th: 'เรียกใช้กิจกรรมผ่านช่องเสียง' })
		.setDefaultMemberPermissions(PermissionFlagsBits.UseEmbeddedActivities)
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.setIntegrationTypes([
			ApplicationIntegrationType.GuildInstall,
			ApplicationIntegrationType.UserInstall,
		])
		.addStringOption((option) =>
			option
				.setName('name')
				.setDescription('Name of the activity you want to start.')
				.setDescriptionLocalizations({ th: 'ชื่อของกิจกรรมที่ต้องการเริ่ม' })
				.setRequired(true)
				.setChoices(
					{ name: 'Watch Together', value: 'youtube' },
					{ name: 'Watch Together Dev', value: 'youtubedev' },
					{ name: 'Poker Night', value: 'poker' },
					{ name: 'Betrayal', value: 'betrayal' },
					{ name: 'Fishing', value: 'fishing' },
					{ name: 'Chess In The Park', value: 'chess' },
					{ name: 'Chess In The Park Dev', value: 'chessdev' },
					{ name: 'Letter League', value: 'Lettertile' },
					{ name: 'WordSnack', value: 'wordsnack' },
					{ name: 'DoodleCrew', value: 'doodlecrew' },
					{ name: 'AwkWord', value: 'awkword' },
					{ name: 'SpellCast', value: 'spellcast' },
					{ name: 'Checkers In The Park', value: 'checkers' },
					{ name: 'Putt Party', value: 'puttparty' },
					{ name: 'Sketch Heads', value: 'sketchheads' },
					{ name: 'Blazing 8s', value: 'blazing8s' },
					{ name: 'Putt Party QA', value: 'puttpartyqa' },
					{ name: 'SketchyArtist', value: 'sketchyartist' },
					{ name: 'Land-io', value: 'land' },
					{ name: 'Meme', value: 'meme' },
					{ name: 'Askaway', value: 'askaway' },
					{ name: 'Bobble League', value: 'bobble' },
				),
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('Voice channel you want to join.')
				.setDescriptionLocalizations({ th: 'ช่องเสียงที่คุณต้องการเข้าร่วม' })
				.setRequired(false)
				.addChannelTypes(ChannelType.GuildVoice),
		),
	async execute(interaction) {
		const inputName = interaction.options.getString('name');
		const inputChannel = interaction.options.getChannel('channel');

		await interaction.deferReply();

		const token = interaction.client.configs.token;
		const voiceChannel = interaction.member.voice.channel;
		const apps = {
			youtube: '880218394199220334',
			youtubedev: '880218832743055411',
			poker: '755827207812677713',
			betrayal: '773336526917861400',
			fishing: '814288819477020702',
			chess: '832012774040141894',
			chessdev: '832012586023256104',
			lettertile: '879863686565621790',
			wordsnack: '879863976006127627',
			doodlecrew: '878067389634314250',
			awkword: '879863881349087252',
			spellcast: '852509694341283871',
			checkers: '832013003968348200',
			puttparty: '763133495793942528',
			sketchheads: '902271654783242291',
			blazing8s: '832025144389533716',
			puttpartyqa: '945748195256979606',
			sketchyartist: '879864070101172255',
			land: '903769130790969345',
			meme: '950505761862189096',
			askaway: '976052223358406656',
			bobble: '947957217959759964',
		};

		if (!inputChannel && !voiceChannel)
			return await interaction.editReply(
				interaction.client.i18n.t('commands.activities.user_not_in_channel'),
			);

		const response = await fetch(
			`https://discord.com/api/v10/channels/${inputChannel.id || voiceChannel.id}/invites`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bot ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					max_age: 86400,
					max_uses: 0,
					target_application_id: apps[inputName],
					target_type: 2,
					temporary: false,
					validate: null,
				}),
			},
		);

		if (response.status !== 200)
			return await interaction.editReply(
				interaction.client.i18n.t('commands.activities.can_not_open', {
					activity_name: inputName,
				}),
			);

		const data = await response.json();

		if (data.code && Number(data.code) === 50013)
			return await interaction.editReply(
				interaction.client.i18n.t('commands.activities.do_not_have_permission'),
			);

		await interaction.editReply(
			interaction.client.i18n.t('commands.activities.join_via_this_link', {
				code: data.code,
			}),
		);
	},
};
