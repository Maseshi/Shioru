const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = (client, emoji) => {
    if (client.mode === "start") {
        settingsData(client, emoji.guild, module.exports, emoji);
        if (client.temp.set !== 1) return;
    }

	const db = getDatabase();
	const childRef = child(ref(db, "Shioru/apps/discord/guilds"), emoji.guild.id);
    const channelRef = child(childRef, "config/notification/emojiCreate");

	get(channelRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
				const notification = emoji.guild.channels.cache.find(channels => channels.id === notifyId);
                const emojiCreateEmbed = new EmbedBuilder()
                    .setTitle(client.translate.events.emojiCreate.system_notification)
                    .setDescription(client.translate.events.emojiCreate.member_create_emoji.replace("%s", emoji.name))
                    .setTimestamp()
                    .setColor("Yellow");

                if (!notification) return;

				notification.send({ "embeds": [emojiCreateEmbed] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, emoji);
            });
        }
    }).catch((error) => {
        catchError(client, emoji.guild.systemChannel, "emojiCreate", error);
    });
};