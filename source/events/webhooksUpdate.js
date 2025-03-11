const { Events, EmbedBuilder, Colors } = require('discord.js');
const {
	submitNotification,
	initializeData,
} = require('../utils/databaseUtils');

module.exports = {
	name: Events.WebhooksUpdate,
	once: false,
	async execute(channel) {
		const webhookUpdateEmbed = new EmbedBuilder()
			.setTitle(
				channel.client.i18n.t('events.webhookUpdate.webhook_notification'),
			)
			.setDescription(
				channel.client.i18n.t('events.webhookUpdate.webhook_update', {
					channel_id: channel.id,
				}),
			)
			.setTimestamp()
			.setColor(Colors.Yellow);

		await initializeData(channel.client, channel.guild);
		await submitNotification(
			channel.client,
			channel.guild,
			Events.WebhooksUpdate,
			webhookUpdateEmbed,
		);
	},
};
