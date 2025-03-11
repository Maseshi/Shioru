const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	PermissionFlagsBits,
	Colors,
	resolveColor,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Randomly select the meme you want.')
		.setDescriptionLocalizations({ th: 'สุ่มเลือกมีมที่คุณต้องการ' })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addStringOption((option) =>
			option
				.setName('category')
				.setDescription('Preferred category of meme')
				.setDescriptionLocalizations({ th: 'หมวดหมู่ของมีมที่ต้องการ' }),
		),
	async execute(interaction) {
		const inputCategory = interaction.options.getString('category') ?? '';

		await interaction.deferReply();

		const randomEmbed = async (choice) => {
			const category = ['meme', 'Memes_Of_The_Dank', 'memes', 'dankmemes'];
			const random = choice
				? choice
				: category[Math.floor(Math.random() * category.length)];

			try {
				const response = await fetch(
					`https://www.reddit.com/r/${random}/random/.json`,
				);
				const post = await response.json();

				if (!Array.isArray(post) || !post.length) {
					return new EmbedBuilder()
						.setColor(Colors.Red)
						.setDescription(
							interaction.client.i18n
								.t('commands.meme.meme_not_found')
								.replace('%s', choice),
						);
				}

				const permalink = post[0].data.children[0].data.permalink;
				const memeUrl = `https://reddit.com${permalink}`;
				const memeImage = post[0].data.children[0].data.url;
				const memeTitle = post[0].data.children[0].data.title;
				const memeUpvotes = post[0].data.children[0].data.ups;
				const memeNumComments = post[0].data.children[0].data.num_comments;
				const memeCreate = post[0].data.children[0].data.created;

				return new EmbedBuilder()
					.setTitle(memeTitle)
					.setURL(memeUrl)
					.setImage(memeImage)
					.setColor(resolveColor('Random'))
					.setFooter({
						text: '👍 %s1 | 💬 %s2'
							.replace('%s1', memeUpvotes)
							.replace('%s2', memeNumComments),
					})
					.setTimestamp(new Date(memeCreate) * 1000);
			} catch (error) {
				return new EmbedBuilder()
					.setColor(Colors.Red)
					.setDescription(
						interaction.client.i18n.t('commands.meme.can_not_fetch'),
					);
			}
		};

		const memeEmbed = await randomEmbed(inputCategory);
		const buttonRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('regenMemeButton')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('🔁'),
		);

		await interaction.editReply({
			embeds: [memeEmbed],
			components: [buttonRow],
		});

		const collector = interaction.channel.createMessageCollector({
			filter: (reactor) => reactor.member.id !== interaction.member.id,
			time: 60,
			max: 3,
			dispose: true,
		});

		collector.on('collect', async (response) => {
			if (response.customId !== 'regenMemeButton') return;
			await response.deferUpdate();

			const randomMemeEmbed = await randomEmbed(inputCategory);

			await interaction.editReply({
				embeds: [randomMemeEmbed],
				components: [buttonRow],
			});
		});
		collector.on('end', async () => {
			buttonRow.components.forEach((button) => button.setDisabled(true));

			await interaction.editReply({ components: [buttonRow] });
		});
	},
};
