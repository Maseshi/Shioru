const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	Colors,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('eat')
		.setDescription('Fake text saying who you are eating.')
		.setDescriptionLocalizations({ th: 'ข้อความปลอมที่บอกว่าคุณกำลังจะกินใคร' })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
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
				.setDescription('The name of what you want to eat.')
				.setDescriptionLocalizations({ th: 'ชื่อของสิ่งที่คุณอยากกิน!' })
				.setRequired(true),
		),
	async execute(interaction) {
		const inputName = interaction.options.getString('name');

		const authorUsername = interaction.user.username;
		const clientUsername = interaction.client.user.username;
		const eatEmbed = new EmbedBuilder()
			.setDescription(
				interaction.client.i18n
					.t('commands.eat.already_eaten')
					.replace('%s1', authorUsername)
					.replace('%s2', inputName),
			)
			.setColor(Colors.Blue);

		if (inputName === clientUsername) {
			await interaction.reply('...');
			setTimeout(async () => {
				await interaction.followUp(
					interaction.client.i18n.t('commands.eat.do_not_eat_me'),
				);
			}, 8000);
			return;
		}

		await interaction.reply({ embeds: [eatEmbed] });
	},
};
