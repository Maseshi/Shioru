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
		.setName('status')
		.setDescription('Check the status of all members within the server')
		.setDescriptionLocalizations({
			th: 'ตรวจสอบสถานะของสมาชิกทั้งหมดภายในเซิร์ฟเวอร์',
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
		.addStringOption((option) =>
			option
				.setName('type')
				.setDescription('The status you want to check.')
				.setDescriptionLocalizations({ th: 'สถานะที่คุณต้องการตรวจสอบ' })
				.setRequired(true)
				.addChoices(
					{ name: 'Online', value: 'online' },
					{ name: 'Offline', value: 'offline' },
					{ name: 'Idle', value: 'idle' },
					{ name: 'Do Not Disturb', value: 'dnd' },
				),
		),
	async execute(interaction) {
		const inputType = interaction.options.getString('type');

		const guildIcon = interaction.guild.iconURL();
		const statusEmbed = new EmbedBuilder().setTimestamp().setFooter({
			text: interaction.client.i18n.t('commands.status.data_by_server'),
			iconURL: guildIcon,
		});

		switch (inputType) {
			case 'online': {
				const onlineCount = interaction.guild.members.cache.filter((members) =>
					members.presence ? members.presence.status === 'online' : null,
				).size;

				statusEmbed
					.setDescription(
						interaction.client.i18n
							.t('commands.status.online_status')
							.replace('%s', onlineCount),
					)
					.setColor(Colors.Green);
				await interaction.reply({ embeds: [statusEmbed] });
				break;
			}
			case 'offline': {
				const offlineCount = interaction.guild.members.cache.filter(
					(members) =>
						members.presence
							? members.presence.status === 'offline'
							: 'offline',
				).size;

				statusEmbed
					.setDescription(
						interaction.client.i18n
							.t('commands.status.offline_status')
							.replace('%s', offlineCount),
					)
					.setColor(Colors.Grey);
				await interaction.reply({ embeds: [statusEmbed] });
				break;
			}
			case 'idle': {
				const idleCount = interaction.guild.members.cache.filter((members) =>
					members.presence ? members.presence.status === 'idle' : null,
				).size;

				statusEmbed
					.setDescription(
						interaction.client.i18n
							.t('commands.status.idle_status')
							.replace('%s', idleCount),
					)
					.setColor(Colors.Yellow);
				await interaction.reply({ embeds: [statusEmbed] });
				break;
			}
			case 'dnd': {
				const dndCount = interaction.guild.members.cache.filter((members) =>
					members.presence ? members.presence.status === 'dnd' : null,
				).size;

				statusEmbed
					.setDescription(
						interaction.client.i18n
							.t('commands.status.dnd_status')
							.replace('%s', dndCount),
					)
					.setColor(Colors.Red);
				await interaction.reply({ embeds: [statusEmbed] });
				break;
			}
		}
	},
};
