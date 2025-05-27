const {
	SlashCommandBuilder,
	EmbedBuilder,
	AttachmentBuilder,
	PermissionFlagsBits,
	Colors,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');
const { join } = require('node:path');
const { readFileSync } = require('node:fs');
const { getDatabase, ref, get } = require('firebase/database');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('View information about me.')
		.setDescriptionLocalizations({ th: 'ดูข้อมูลเกี่ยวกับฉัน' })
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
		.addSubcommand((subcommand) =>
			subcommand
				.setName('personal')
				.setDescription('View personal information about me')
				.setDescriptionLocalizations({ th: 'ดูข้อมูลส่วนตัวเกี่ยวฉัน' }),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('license')
				.setDescription('Understanding copyrighted content')
				.setDescriptionLocalizations({
					th: 'ทำความเข้าใจกับเนื้อหาที่มีลิขสิทธิ์',
				}),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('stats')
				.setDescription('Check out my interesting stats.')
				.setDescriptionLocalizations({
					th: 'ตรวจดูข้อมูลสถิติที่น่าสนใจของฉัน',
				}),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		const clientAvatar = interaction.client.user.displayAvatarURL();
		const clientUsername = interaction.client.user.username;

		switch (subcommand) {
			case 'personal': {
				const aboutPersonalEmbed = new EmbedBuilder()
					.setTitle(interaction.client.i18n.t('commands.about.my_personal'))
					.setDescription(
						interaction.client.i18n.t('commands.about.my_personal_detail', {
							name: clientUsername,
							website_link: 'https://shiorus.web.app/',
							pp_link: 'https://maseshi.web.app/privacy-policy',
							tos_link: 'https://maseshi.web.app/terms-of-service',
							interpolation: { escapeValue: false },
						}),
					)
					.setColor(Colors.Blue)
					.setAuthor({
						name: clientUsername,
						iconURL: clientAvatar,
						url: 'https://shiorus.web.app/',
					})
					.setFooter({
						text: interaction.client.i18n.t('commands.about.copyright'),
					});

				await interaction.reply({ embeds: [aboutPersonalEmbed] });
				break;
			}
			case 'license': {
				const licensePath = join(__dirname, '..', '..', '..');
				const MITLicense = readFileSync(join(licensePath, 'LICENSE'), {
					encoding: 'utf-8',
				});
				const CCZeroLicense = readFileSync(
					join(licensePath, 'LICENSE-ASSETS'),
					{ encoding: 'utf-8' },
				);

				await interaction.reply({
					files: [
						new AttachmentBuilder(Buffer.from(MITLicense), {
							name: 'LICENSE.txt',
						}),
						new AttachmentBuilder(Buffer.from(CCZeroLicense), {
							name: 'LICENSE-ASSETS.txt',
						}),
					],
				});
				break;
			}
			case 'stats': {
				await interaction.deferReply();

				const statisticsRef = ref(getDatabase(), 'statistics');
				const statisticsSnapshot = await get(statisticsRef);

				const totalCommands = interaction.client.commands.size ?? 0;
				const totalWorked = statisticsSnapshot.val().commands.size ?? 0;
				const totalQueues = interaction.client.player.queues.size ?? 0;
				const totalVoices = interaction.client.player.voices.size ?? 0;

				const statsEmbed = new EmbedBuilder()
					.setColor(Colors.Blue)
					.setAuthor({ iconURL: clientAvatar, name: clientUsername })
					.setTitle(interaction.client.i18n.t('commands.about.stats'))
					.setDescription(
						interaction.client.i18n.t('commands.about.public_stats'),
					)
					.setTimestamp()
					.setFields([
						{
							name: interaction.client.i18n.t('commands.about.commands'),
							value: String(totalCommands),
							inline: true,
						},
						{
							name: interaction.client.i18n.t('commands.about.worked'),
							value: String(totalWorked),
							inline: true,
						},
						{
							name: interaction.client.i18n.t('commands.about.connection'),
							value: `${String(totalQueues)}/${String(totalVoices)}`,
							inline: true,
						},
					]);

				if (interaction.client.shard && interaction.client.shard.count) {
					const results = await Promise.all([
						interaction.client.shard.fetchClientValues('guilds.cache.size'),
						interaction.client.shard.broadcastEval((client) =>
							client.guilds.cache.reduce(
								(acc, guild) => acc + guild.memberCount,
								0,
							),
						),
					]);
					const totalGuilds = results[0].reduce(
						(acc, guildCount) => acc + guildCount,
						0,
					);
					const totalMembers = results[1].reduce(
						(acc, memberCount) => acc + memberCount,
						0,
					);
					const totalShards = interaction.client.shard.count;

					statsEmbed.addFields([
						{
							name: interaction.client.i18n.t('commands.about.guilds'),
							value: String(totalGuilds),
							inline: true,
						},
						{
							name: interaction.client.i18n.t('commands.about.members'),
							value: String(totalMembers),
							inline: true,
						},
						{
							name: interaction.client.i18n.t('commands.about.shards'),
							value: String(totalShards),
							inline: true,
						},
					]);
				} else {
					const totalGuilds = interaction.client.guilds.cache.size;
					const totalMembers = interaction.client.users.cache.size;

					statsEmbed.addFields([
						{
							name: interaction.client.i18n.t('commands.about.guilds'),
							value: String(totalGuilds),
							inline: true,
						},
						{
							name: interaction.client.i18n.t('commands.about.members'),
							value: String(totalMembers),
							inline: true,
						},
					]);
				}

				await interaction.editReply({ embeds: [statsEmbed] });
				break;
			}
		}
	},
};
