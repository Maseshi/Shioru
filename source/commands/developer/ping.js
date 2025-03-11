const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	Colors,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	cooldown: 5,
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the ping and api latency of the bot.')
		.setDescriptionLocalizations({
			th: 'ตรวจสอบความหน่วงและ API Latency ของเซิร์ฟเวอร์',
		})
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		]),
	async execute(interaction) {
		const message = await interaction.reply({
			content: interaction.client.i18n.t('commands.ping.waiting'),
			fetchReply: true,
		});
		const roundtrip = message.createdTimestamp - interaction.createdTimestamp;
		const websocket = interaction.client.ws.ping;

		const pingEmbed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setTitle(interaction.client.i18n.t('commands.ping.connection'))
			.setDescription(
				interaction.client.i18n
					.t('commands.ping.info')
					.replace('%s1', roundtrip)
					.replace('%s2', websocket),
			);

		await interaction.editReply({
			content: interaction.client.i18n.t('commands.ping.result'),
			embeds: [pingEmbed],
		});
	},
};
