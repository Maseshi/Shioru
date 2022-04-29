const { getDatabase, ref, child, get, set } = require("firebase/database");
const settingsData = require("../../extras/settingsData");
const catchError = require("../../extras/catchError");

module.exports = (member) => {
    const client = member.client;

    if (member.user.bot) return;
    if (client.mode === "start") {
        settingsData(client, member.guild, module.exports);
        if (client.config.worker !== 1) return;
    }

	const db = getDatabase();
	const childRef = child(ref(db, "Shioru/apps/discord/guilds"), member.guild.id);

	get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.guildMemberRemove;

            if (notifyId) {
				const notification = member.guild.channels.cache.find(channels => channels.id === notifyId);

                if (!notification) return;

				notification.send({
                    "embeds": [
                        {
                            "title": member.user.username,
                            "description": client.translate.events.guildMemberRemove.user_has_exited,
                            "timestamp": new Date(),
                            "color": 16777215,
                            "thumbnail": {
                                "url": member.user.displayAvatarURL(),
                            }
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
                module.exports(client, member);
            });
        }
    }).catch((error) => {
        catchError(client, member.guild.systemChannel, "guildMemberRemove", error);
    });
};