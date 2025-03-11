const { Events, EmbedBuilder, StickerFormatType } = require('discord.js');
const {
	submitNotification,
	initializeData,
} = require('../utils/databaseUtils');

module.exports = {
	name: Events.GuildStickerUpdate,
	once: false,
	async execute(oldSticker, newSticker) {
		const stickerUpdateEmbed = new EmbedBuilder()
			.setTitle(
				newSticker.client.i18n.t('events.stickerUpdate.sticker_notification'),
			)
			.setDescription(
				newSticker.client.i18n
					.t('events.stickerUpdate.sticker_update')
					.replace('%s1', oldSticker.name)
					.replace('%s2', newSticker.id),
			)
			.setThumbnail(
				newSticker.format !== StickerFormatType.Lottie ? newSticker.url : '',
			)
			.setTimestamp()
			.setColor('Yellow');

		await initializeData(newSticker.client, newSticker.guild);
		await submitNotification(
			newSticker.client,
			newSticker.guild,
			Events.GuildStickerUpdate,
			stickerUpdateEmbed,
		);
	},
};
