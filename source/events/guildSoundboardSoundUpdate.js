const { Events, EmbedBuilder, Colors } = require('discord.js');
const {
	submitNotification,
	initializeData,
} = require('../utils/databaseUtils');

module.exports = {
	name: Events.GuildSoundboardSoundUpdate,
	once: false,
	async execute(oldSoundboardSound, newSoundboardSound) {
		const guildSoundboardSoundUpdateEmbed = new EmbedBuilder()
			.setTitle(
				newSoundboardSound.client.i18n.t(
					'events.guildSoundboardSoundUpdate.soundboard_notification',
				),
			)
			.setDescription(
				newSoundboardSound.client.i18n.t(
					'events.guildSoundboardSoundUpdate.soundboard_updated',
					{
						old_emoji_identifier: oldSoundboardSound.emoji.identifier || ':x:',
						old_soundboard_name:
							oldSoundboardSound.name ||
							newSoundboardSound.client.i18n.t(
								'events.guildSoundboardSoundUpdate.deleted',
							),
						new_emoji_identifier: newSoundboardSound.emoji.identifier,
						new_soundboard_name: newSoundboardSound.name,
					},
				),
			)
			.setTimestamp()
			.setColor(Colors.Blue);

		await initializeData(newSoundboardSound.client, newSoundboardSound.guild);
		await submitNotification(
			newSoundboardSound.client,
			newSoundboardSound.guild,
			module.exports.name,
			guildSoundboardSoundUpdateEmbed,
		);
	},
};
