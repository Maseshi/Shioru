const { getDatabase, ref, child, get, set } = require("firebase/database");
const settingsData = require("../../extras/settingsData");
const catchError = require("../../extras/catchError");

module.exports = (emoji) => {
    const client = emoji.client;

    if (client.mode === "start") {
        settingsData(client, emoji.guild, module.exports);
        if (client.config.worker !== 1) return;
    }

	const db = getDatabase();
	const childRef = child(ref(db, "Shioru/apps/discord/guilds"), emoji.guild.id);

	get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.emojiCreate;

            if (notifyId) {
				const notification = emoji.guild.channels.cache.find(channels => channels.id === notifyId);

                if (!notification) return;

				notification.send({
                    "embeds": [
                        {
                            "title": client.translate.events.emojiCreate.system_notification,
                            "description": client.translate.events.emojiCreate.member_create_emoji.replace("%s", emoji.name),
                            "timestamp": new Date(),
                            "color": 4886754
                        }
                    ]
                });
            }
        } else {
            set(child(childRef, "config"), {
                "prefix": "S",
                "language": "en",
                "notification": {
                    "alert": false,
                    "channelCreate": false,
                    "channelDelete": false,
                    "channelPinsUpdate": false,
                    "channelUpdate": false,
                    "emojiCreate": false,
                    "emojiDelete": false,
                    "emojiUpdate": false,
                    "guildMemberAdd": false,
                    "guildMemberRemove": false
                }
            }).then(() => {
                module.exports(client, emoji);
            });
        }
    }).catch((error) => {
        catchError(client, emoji.guild.systemChannel, "emojiCreate", error);
    });
};