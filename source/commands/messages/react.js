const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');
const { matchEmotes } = require('../../utils/miscUtils');
const { catchError } = require('../../utils/consoleUtils');

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ManageMessages,
	],
	data: new SlashCommandBuilder()
		.setName('react')
		.setDescription('Interact with the desired message')
		.setDescriptionLocalizations({ th: 'โต้ตอบกับข้อความที่ต้องการ' })
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
				.setName('id')
				.setDescription('ID of the message you want to interact')
				.setDescriptionLocalizations({ th: 'ไอดีของข้อความที่ต้องการโต้ตอบ' })
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('emoji')
				.setDescription('Emoji to interact with')
				.setDescriptionLocalizations({ th: 'อีโมจิที่ต้องการโต้ตอบ' })
				.setRequired(true),
		),
	async execute(interaction) {
		const inputID = interaction.options.getString('id');
		const inputEmoji = interaction.options.getString('emoji');

		try {
			const message = await interaction.channel.messages.fetch(inputID);
			const emojis = matchEmotes(inputEmoji);

			if (!message)
				return await interaction.reply({
					content: interaction.client.i18n.t(
						'commands.react.message_not_found',
					),
					ephemeral: true,
				});
			if (!emojis || !emojis.length)
				return await interaction.reply({
					content: interaction.client.i18n.t(
						'commands.react.look_like_is_not_emoji',
					),
					ephemeral: true,
				});

			for (const emoji of emojis) {
				await message.react(emoji);
			}
		} catch (error) {
			if (error.code === 10014)
				return await interaction.reply(
					interaction.client.i18n.t('commands.react.do_not_have_emoji'),
				);

			catchError(
				interaction.client,
				interaction,
				module.exports.data.name,
				error,
			);
		}

		await interaction.reply({
			content: interaction.client.i18n.t('commands.react.reacted'),
			ephemeral: true,
		});
	},
};
