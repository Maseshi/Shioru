const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');
const {
	getDatabase,
	ref,
	child,
	get,
	update,
	remove,
} = require('firebase/database');
const { catchError } = require('../../utils/consoleUtils');

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ChangeNickname,
	],
	data: new SlashCommandBuilder()
		.setName('afk')
		.setDescription('Go AFK within your server.')
		.setDescriptionLocalizations({ th: 'ไป AFK ภายในเซิร์ฟเวอร์ของคุณ' })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
		.addSubcommand((subcommand) =>
			subcommand
				.setName('set')
				.setDescription('Set your status to AFK.')
				.setDescriptionLocalizations({ th: 'ตั้งสถานะของคุณเป็น AFK' })
				.addStringOption((option) =>
					option
						.setName('message')
						.setDescription("The reason you'll be AFK.")
						.setDescriptionLocalizations({
							th: 'เหตุผลที่คุณจะไม่อยู่ที่หน้าจอ (AFK)',
						})
						.setRequired(false),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Unset your status to AFK.')
				.setDescriptionLocalizations({ th: 'ยกเลิกตั้งสถานะของคุณเป็น AFK' }),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const inputMessage = interaction.options.getString('message') ?? '';

		const guildRef = child(ref(getDatabase(), 'guilds'), interaction.guild.id);
		const guildSnapshot = await get(guildRef);

		const nickname = interaction.member.nickname || interaction.user.username;

		switch (subcommand) {
			case 'set':
				if (guildSnapshot.exists()) {
					const guildData = guildSnapshot.val();

					if (guildData.afk && guildData.afk[interaction.user.id]) {
						return await interaction.reply({
							content: interaction.client.i18n.t('commands.afk.currently_afk'),
							ephemeral: true,
						});
					}
				}

				await update(child(guildRef, interaction.user.id), {
					message: inputMessage,
					nickname: nickname,
				});

				try {
					await interaction.member.setNickname('[AFK] ' + nickname);
				} catch (error) {
					catchError(
						interaction.client,
						interaction,
						module.exports.data.name,
						error,
						true,
					);
				}

				await interaction.reply({
					content: interaction.client.i18n.t('commands.afk.now_afk'),
					ephemeral: true,
				});
				break;
			case 'remove': {
				if (!guildSnapshot.exists())
					return await interaction.reply({
						content: interaction.client.i18n.t('commands.afk.currently_afk'),
						ephemeral: true,
					});

				const guildData = guildSnapshot.val();

				if (guildData.afk || guildData.afk[interaction.user.id])
					return await interaction.reply({
						content: interaction.client.i18n.t(
							'commands.afk.currently_not_afk',
						),
						ephemeral: true,
					});

				const afk = guildData.afk;

				try {
					await interaction.member.setNickname(
						afk[interaction.user.id].nickname,
					);
				} catch (error) {
					catchError(
						interaction.client,
						interaction,
						module.exports.data.name,
						error,
						true,
					);
				}

				await remove(child(child(guildRef, 'afk'), interaction.user.id));
				await interaction.reply({
					content: interaction.client.i18n.t('commands.afk.now_not_afk'),
					ephemeral: true,
				});
				break;
			}
		}
	},
};
