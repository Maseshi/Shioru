const { Events, EmbedBuilder } = require("discord.js");
const {
	submitNotification,
	initializeData,
} = require("../utils/databaseUtils");

module.exports = {
	name: Events.GuildEmojiUpdate,
	once: false,
	async execute(oldEmoji, newEmoji) {
		const emojiUpdateEmbed = new EmbedBuilder()
			.setTitle(newEmoji.client.i18n.t("events.emojiUpdate.emoji_notification"))
			.setDescription(
				newEmoji.client.i18n
					.t("events.emojiUpdate.member_update_emoji")
					.replace("%s1", oldEmoji.name)
					.replace("%s2", newEmoji.name),
			)
			.setTimestamp()
			.setColor("Yellow");

		await initializeData(newEmoji.client, newEmoji.guild);
		await submitNotification(
			newEmoji.client,
			newEmoji.guild,
			Events.GuildEmojiUpdate,
			emojiUpdateEmbed,
		);
	},
};
