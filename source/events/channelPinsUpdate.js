const { Events, EmbedBuilder } = require('discord.js');
const {
	submitNotification,
	initializeData,
} = require('../utils/databaseUtils');

module.exports = {
	name: Events.ChannelPinsUpdate,
	once: false,
	async execute(channel, time) {
		const channelPiusUpdateEmbed = new EmbedBuilder()
			.setTitle(
				channel.client.i18n.t('events.channelPinsUpdate.channel_notification'),
			)
			.setDescription(
				channel.client.i18n
					.t('events.channelPinsUpdate.member_pins_in_channel')
					.replace('%s1', channel.id)
					.replace('%s2', time),
			)
			.setTimestamp()
			.setColor('Yellow');

		await initializeData(channel.client, channel.guild);
		await submitNotification(
			channel.client,
			channel.guild,
			Events.ChannelPinsUpdate,
			channelPiusUpdateEmbed,
		);
	},
};
