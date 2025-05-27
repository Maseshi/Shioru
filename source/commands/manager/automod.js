const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');
const { catchError } = require('../../utils/consoleUtils');

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ManageGuild,
	],
	data: new SlashCommandBuilder()
		.setName('automod')
		.setDescription('Manage your server with automation.')
		.setDescriptionLocalizations({
			th: 'จัดการเซิร์ฟเวอร์ของคุณด้วยระบบอัตโนมัติ',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts([
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
		.addSubcommand((subcommand) =>
			subcommand
				.setName('flagged_words')
				.setDescription('Block profanity, sexual content, and slurs')
				.setDescriptionLocalizations({
					th: 'บล็อกคำหยาบคาย เนื้อหาเกี่ยวกับเรื่องเพศ และคำสบประมาท',
				}),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('spam_messages')
				.setDescription('Prevent message spam')
				.setDescriptionLocalizations({ th: 'ป้องกันการสแปมข้อความ' }),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('mention_spam')
				.setDescription('Prevent unnecessary mention spam.')
				.setDescriptionLocalizations({
					th: 'ป้องกันการสแปมการกล่าวถึงที่ไม่จำเป็น',
				})
				.addIntegerOption((option) =>
					option
						.setName('count')
						.setDescription('Number of unnecessary mentions')
						.setDescriptionLocalizations({
							th: 'จำนวนของการกล่าวถึงที่ไม่จำเป็น',
						})
						.setRequired(true)
						.setMinValue(0)
						.setMaxValue(50),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('keyword')
				.setDescription('Block unwanted or forbidden words.')
				.setDescriptionLocalizations({
					th: 'บล็อคคำที่ไม่ต้องการหรือคำต้องห้าม',
				})
				.addStringOption((option) =>
					option
						.setName('word')
						.setDescription(
							'Words to be blocked which, if found, will not be able to send messages.',
						)
						.setDescriptionLocalizations({
							th: 'คำที่ต้องการบล็อค ซึ่งหากพบจะไม่สามารถส่งข้อความได้',
						})
						.setRequired(true)
						.setMinLength(0)
						.setMaxLength(1000),
				)
				.addStringOption((option) =>
					option
						.setName('regex_patterns')
						.setDescription(
							'Regular expression patterns which will be matched against content',
						)
						.setDescriptionLocalizations({
							th: 'รูปแบบนิพจน์ทั่วไปซึ่งจะจับคู่กับเนื้อหา',
						})
						.setRequired(false)
						.setMinLength(0)
						.setMaxLength(10),
				)
				.addStringOption((option) =>
					option
						.setName('allow_list')
						.setDescription('Substrings which should not trigger the rule')
						.setDescriptionLocalizations({ th: 'คำย่อยที่ไม่ควรเรียกใช้กฎ' })
						.setRequired(false)
						.setMinLength(0)
						.setMaxLength(100),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const inputCount = interaction.options.getInteger('count') ?? 0;
		const inputWord = interaction.options.getString('word') ?? '';
		const inputRegexPatterns =
			interaction.options.getString('regex_patterns') ?? '';
		const inputAllowList = interaction.options.getString('allow_list') ?? '';

		const teamOwner = parseInt(interaction.client.configs.team.owner);

		switch (subcommand) {
			case 'flagged_words':
				try {
					const flaggedWordsRule =
						await interaction.guild.autoModerationRules.create({
							name: interaction.client.i18n.t(
								'commands.automod.flagged_words_name',
							),
							creatorId: teamOwner,
							enabled: true,
							eventType: 1,
							triggerType: 4,
							triggerMetadata: { presets: [1, 2, 3] },
							actions: [
								{
									type: 1,
									metadata: {
										channel: interaction.channel,
										durationSeconds: 10,
										customMessage: interaction.client.i18n.t(
											'commands.automod.prevent_message',
										),
									},
								},
							],
						});

					if (!flaggedWordsRule) return;

					const flaggedWordsEmbed = new EmbedBuilder()
						.setColor('Blue')
						.setDescription(
							interaction.client.i18n.t(
								'commands.automod.flagged_words_success',
							),
						);

					await interaction.reply({ content: '', embeds: [flaggedWordsEmbed] });
				} catch (error) {
					catchError(
						interaction.client,
						interaction,
						module.exports.data.name,
						error,
					);
				}
				break;
			case 'spam_messages':
				try {
					const spamMessagesRule =
						await interaction.guild.autoModerationRules.create({
							name: interaction.client.i18n.t(
								'commands.automod.spam_messages_name',
							),
							creatorId: teamOwner,
							enabled: true,
							eventType: 1,
							triggerType: 3,
							triggerMetadata: {},
							actions: [
								{
									type: 1,
									metadata: {
										channel: interaction.channel,
										durationSeconds: 10,
										customMessage: interaction.client.i18n.t(
											'commands.automod.prevent_message',
										),
									},
								},
							],
						});

					if (!spamMessagesRule) return;

					const spamMessagesEmbed = new EmbedBuilder()
						.setColor('Blue')
						.setDescription(
							interaction.client.i18n.t(
								'commands.automod.spam_messages_success',
							),
						);

					await interaction.reply({ content: '', embeds: [spamMessagesEmbed] });
				} catch (error) {
					catchError(
						interaction.client,
						interaction,
						module.exports.data.name,
						error,
					);
				}
				break;
			case 'mention_spam':
				try {
					const mentionSpamRule =
						await interaction.guild.autoModerationRules.create({
							name: interaction.client.i18n.t(
								'commands.automod.mention_spam_name',
							),
							creatorId: teamOwner,
							enabled: true,
							eventType: 1,
							triggerType: 5,
							triggerMetadata: { mentionTotalLimit: inputCount },
							actions: [
								{
									type: 1,
									metadata: {
										channel: interaction.channel,
										durationSeconds: 10,
										customMessage: interaction.client.i18n.t(
											'commands.automod.prevent_message',
										),
									},
								},
							],
						});

					if (!mentionSpamRule) return;

					const mentionSpamEmbed = new EmbedBuilder()
						.setColor('Blue')
						.setDescription(
							interaction.client.i18n.t(
								'commands.automod.mention_spam_success',
							),
						);

					await interaction.reply({ content: '', embeds: [mentionSpamEmbed] });
				} catch (error) {
					catchError(
						interaction.client,
						interaction,
						module.exports.data.name,
						error,
					);
				}
				break;
			case 'keyword':
				try {
					const keywordRule =
						await interaction.guild.autoModerationRules.create({
							name: interaction.client.i18n
								.t('commands.automod.keyword_name')
								.replace('%s', inputWord),
							creatorId: teamOwner,
							enabled: true,
							eventType: 1,
							triggerType: 1,
							triggerMetadata: {
								keywordFilter: [inputWord],
								regexPatterns: [inputRegexPatterns],
								allowList: [inputAllowList],
							},
							actions: [
								{
									type: 1,
									metadata: {
										channel: interaction.channel,
										durationSeconds: 10,
										customMessage: interaction.client.i18n.t(
											'commands.automod.prevent_message',
										),
									},
								},
							],
						});

					if (!keywordRule) return;

					const keywordEmbed = new EmbedBuilder()
						.setColor('Blue')
						.setDescription(
							interaction.client.i18n
								.t('commands.automod.keyword_success')
								.replace('%s', inputWord),
						);

					await interaction.reply({ content: '', embeds: [keywordEmbed] });
				} catch (error) {
					catchError(
						interaction.client,
						interaction,
						module.exports.data.name,
						error,
					);
				}
				break;
		}
	},
};
