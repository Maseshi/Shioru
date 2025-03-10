const {
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	ComponentType,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	PermissionFlagsBits,
	Colors,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.EmbedLinks,
	],
	data: new SlashCommandBuilder()
		.setName("anime")
		.setDescription("Search for anime or manga available on Kitsu.")
		.setDescriptionLocalizations({
			th: "ค้นหาอะนิเมะหรือมังงะที่มีอยู่ใน Kitsu",
		})
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addStringOption((option) =>
			option
				.setName("search")
				.setDescription("Search about what you want.")
				.setDescriptionLocalizations({ th: "ค้นหาเกี่ยวกับสิ่งที่ต้องการ" })
				.setChoices(
					{
						name: "Anime",
						name_localizations: { th: "อนิเมะ" },
						value: "anime",
					},
					{
						name: "Manga",
						name_localizations: { th: "มังงะ" },
						value: "manga",
					},
					{
						name: "Characters",
						name_localizations: { th: "ตัวละคร" },
						value: "characters",
					},
				)
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription(
					"Find information on selected anime, manga or characters.",
				)
				.setDescriptionLocalizations({
					th: "ค้นหาข้อมูลที่เลือกอนิเมะ, มังงะหรือตัวละคร",
				})
				.setRequired(true),
		),
	async execute(interaction) {
		const inputSearch = interaction.options.getString("search");
		const inputQuery = interaction.options.getString("query");

		await interaction.deferReply();

		const clientAvatar = interaction.client.user.avatarURL();
		const animeEmbed = new EmbedBuilder()
			.setColor(Colors.Orange)
			.setTitle(
				interaction.client.i18n.t("commands.anime.anime_manga_or_characters"),
			)
			.setDescription(
				interaction.client.i18n.t("commands.anime.similar_stories", {
					title: inputQuery,
				}),
			)
			.setFooter({
				text: interaction.client.i18n.t("commands.anime.auto_cancel"),
				iconURL: clientAvatar,
			});
		const animeSelect = new StringSelectMenuBuilder()
			.setCustomId("anime-choose")
			.setPlaceholder(interaction.client.i18n.t("commands.anime.choose_title"));
		const animeRow = new ActionRowBuilder().addComponents(animeSelect);

		const response = await fetch(
			`https://kitsu.io/api/edge/${inputSearch}?page[limit]=5&filter[text]=${inputQuery}`,
			{
				headers: {
					Accept: "application/vnd.api+json",
					"Content-Type": "application/vnd.api+json",
				},
			},
		);

		if (response.status !== 200)
			return await interaction.editReply(
				interaction.client.i18n.t("commands.anime.data_not_found"),
			);

		const data = await response.json();
		const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

		for (let i = 0; i < data.data.length; i++) {
			const attributes = data.data[i].attributes;
			const slug = attributes.slug;
			const name = attributes.name;
			const titlesEnJp = attributes.titles.en_jp;
			const titleEn = attributes.titles.en;

			animeEmbed.addFields(
				inputSearch === "characters"
					? [{ name: `${i + 1}. ${slug}`, value: name }]
					: [
							{
								name: `${i + 1}. ${titlesEnJp || interaction.client.i18n.t("commands.anime.undefined")}`,
								value:
									titleEn ||
									interaction.client.i18n.t("commands.anime.undefined"),
							},
						],
			);
			animeSelect.addOptions(
				new StringSelectMenuOptionBuilder()
					.setEmoji(emojis[i])
					.setLabel(
						inputSearch === "characters"
							? name
							: titleEn ||
									titlesEnJp ||
									interaction.client.i18n.t("commands.anime.undefined"),
					)
					.setValue(String(i)),
			);
		}

		const message = await interaction.editReply({
			embeds: [animeEmbed],
			components: [animeRow],
		});
		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			filter: (inter) => inter.user.id === interaction.user.id,
			time: 60_000,
		});

		collector.on("collect", async (inter) => {
			const animeSelection = inter.values[0];

			const index = Number(animeSelection);
			const link = data.data[index].links.self;
			const attributes = data.data[index].attributes;
			const name = attributes.name;
			const description = attributes.description;
			const synopsis = attributes.synopsis;
			const titlesEnJp = attributes.titles.en_jp;
			const titlesEn = attributes.titles.en;
			const canonicalTitle = attributes.canonicalTitle;
			const startDate = attributes.startDate;
			const endDate = attributes.endDate;
			const popularityRank = attributes.popularityRank;
			const ratingRank = attributes.ratingRank;
			const ageRatingGuide = attributes.ageRatingGuide;
			const subtype = attributes.subtype;
			const status = attributes.status;
			const image = attributes.image?.original;
			const posterImage = attributes.posterImage?.original;
			const coverImage = attributes.coverImage?.original;
			const chapterCount = attributes.chapterCount;
			const episodeCount = attributes.episodeCount;
			const youtubeVideoId = attributes.youtubeVideoId;

			const animeTrailerButton = new ButtonBuilder()
				.setLabel(inter.client.i18n.t("commands.anime.trailer"))
				.setURL(`https://youtu.be/${youtubeVideoId}`)
				.setStyle(ButtonStyle.Link);
			const animeTrailerButtonRow = new ActionRowBuilder().addComponents(
				animeTrailerButton,
			);

			animeEmbed
				.setDescription(
					inter.client.i18n.t("commands.anime.selection_detail", {
						title: canonicalTitle || name || null,
					}),
				)
				.setThumbnail(posterImage || null)
				.setImage(coverImage || image || null)
				.setFooter(null)
				.setFields(
					inputSearch === "characters"
						? [
								{
									name: inter.client.i18n.t("commands.anime.name"),
									value: `[${name}](${link} '${inter.client.i18n.t("commands.anime.learn_more")}')`,
								},
								{
									name: inter.client.i18n.t("commands.anime.synopsis"),
									value: description,
								},
							]
						: [
								{
									name: inter.client.i18n.t("commands.anime.japan_name"),
									value:
										titlesEnJp ||
										inter.client.i18n.t("commands.anime.undefined"),
								},
								{
									name: inter.client.i18n.t("commands.anime.english_name"),
									value: titlesEn
										? `[${titlesEn}](${link} '${inter.client.i18n.t("commands.anime.learn_more")}')`
										: inter.client.i18n.t("commands.anime.undefined"),
								},
								{
									name: inter.client.i18n.t("commands.anime.status"),
									value: status,
									inline: true,
								},
								{
									name: inter.client.i18n.t("commands.anime.age_rating_guide"),
									value:
										ageRatingGuide ||
										inter.client.i18n.t("commands.anime.undefined"),
									inline: true,
								},
								{
									name: inter.client.i18n.t("commands.anime.subtype"),
									value: subtype,
									inline: true,
								},
								{
									name: inter.client.i18n.t("commands.anime.episode_count"),
									value: chapterCount
										? String(chapterCount)
										: String(episodeCount),
									inline: true,
								},
								{
									name: inter.client.i18n.t("commands.anime.release_date"),
									value:
										startDate || endDate
											? `${startDate} | ${endDate}`
											: inter.client.i18n.t("commands.anime.in_progress"),
									inline: true,
								},
								{
									name: inter.client.i18n.t("commands.anime.popularity_rank"),
									value: popularityRank
										? `#${String(popularityRank)}`
										: inter.client.i18n.t("commands.anime.undefined"),
									inline: true,
								},
								{
									name: inter.client.i18n.t("commands.anime.rating_rank"),
									value: ratingRank
										? `#${String(ratingRank)}`
										: inter.client.i18n.t("commands.anime.undefined"),
									inline: true,
								},
								{
									name: inter.client.i18n.t("commands.anime.synopsis"),
									value:
										synopsis.length >= 1015
											? `\`\`\`${attributes.synopsis.substring(0, 1015)}...\`\`\``
											: `\`\`\`${attributes.synopsis}\`\`\``,
								},
							],
				);

			await inter.update({
				embeds: [animeEmbed],
				components: youtubeVideoId ? [animeTrailerButtonRow] : [],
			});
		});
		collector.on("end", async (collected) => {
			await interaction.editReply({ embeds: [animeEmbed] });
		});
	},
};
