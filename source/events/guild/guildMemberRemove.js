const { getDatabase, ref, child, get, set } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports = (client, member) => {
    if (member.user.bot) return;

	const db = getDatabase();
	const childRef = child(ref(db, "Shioru/apps/discord/guilds"), channel.guild.id);

	get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.guildMemberRemove;

            if (notifyId && notifyId !== 0) {
				const notification = member.guild.channels.cache.find(channels => channels.id === notifyId);
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
                    "alert": 0,
                    "channelCreate": 0,
                    "channelDelete": 0,
                    "channelPinsUpdate": 0,
                    "channelUpdate": 0,
                    "emojiCreate": 0,
                    "guildMemberAdd": 0,
                    "guildMemberRemove": 0
                }
            }).then(() => {
                module.exports(client, member);
            });
        }
    }).catch((error) => {
        catchError(client, message, "guildMemberRemove", error);
    });
};