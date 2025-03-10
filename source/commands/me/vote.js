const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	resolveColor,
	InteractionContextType,
} = require("discord.js");

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("vote")
		.setDescription("Vote for me on top.gg")
		.setDescriptionLocalizations({ th: "โหวตคะแนนให้ฉันบน top.gg" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		]),
	async execute(interaction) {
		await interaction.deferReply();

		const response = await fetch(`https://top.gg/api/bots/${clientUserID}`, {
			headers: { Authorization: interaction.client.configs.top_gg_token },
		});

		if (response.status === 404)
			return await interaction.editReply(
				interaction.client.i18n.t("commands.vote.not_found"),
			);
		if (response.status === 401)
			return await interaction.editReply(
				interaction.client.i18n.t("commands.vote.unauthorized"),
			);
		if (response.status !== 200)
			return await interaction.editReply(
				interaction.client.i18n.t("commands.vote.error"),
			);

		const data = await response.json();
		const date = data.date;
		const invite = data.invite;
		const point = data.points;
		const shortDescription = data.shortdesc;
		const tags = data.tags;

		const voteRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setURL(invite)
				.setLabel(interaction.client.i18n.t("commands.vote.invite"))
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setURL(`https://top.gg/bot/${clientUserID}/vote`)
				.setLabel(interaction.client.i18n.t("commands.vote.vote"))
				.setStyle(ButtonStyle.Link),
		);

		const clientAvatar = interaction.client.user.avatarURL();
		const clientUsername = interaction.client.user.username;
		const clientUserID = interaction.client.user.id;
		const voteEmbed = new EmbedBuilder()
			.setTitle(clientUsername)
			.setURL(`https://top.gg/bot/${clientUserID}`)
			.setDescription(`\`\`\`${shortDescription}\`\`\``)
			.setFields(
				{
					name: interaction.client.i18n.t("commands.vote.rate"),
					value: String(point),
					inline: false,
				},
				{
					name: interaction.client.i18n.t("commands.vote.tags"),
					value: tags.join(", "),
					inline: false,
				},
			)
			.setThumbnail(clientAvatar)
			.setColor(resolveColor("#FF3366"))
			.setTimestamp(new Date(date))
			.setFooter({ text: interaction.client.i18n.t("commands.vote.added") })
			.setAuthor({
				name: "top.gg",
				iconURL: `https://top.gg/favicon.png`,
				url: "https://top.gg",
			});

		await interaction.editReply({ embeds: [voteEmbed], components: [voteRow] });
	},
};
