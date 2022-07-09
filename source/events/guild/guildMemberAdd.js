const { getDatabase, ref, child, get, set } = require("firebase/database");
const settingsData = require("../../extras/settingsData");
const catchError = require("../../extras/catchError");

module.exports = (client, member) => {
    if (member.user.bot) return;
    if (client.mode === "start") {
        settingsData(client, member.guild, module.exports, member);
        if (client.temp.set !== 1) return;
    }

	const db = getDatabase();
	const childRef = child(ref(db, "Shioru/apps/discord/guilds"), member.guild.id);

	get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.guildMemberAdd;

            if (notifyId) {
				const notification = member.guild.channels.cache.find(channels => channels.id === notifyId);

                if (!notification) return;

                notification.send({
                    "embeds": [
                        {
                            "title": member.user.tag,
                            "description": client.translate.events.guildMemberAdd.greet,
                            "timestamp": new Date(),
                            "color": 16777215,
                            "thumbnail": {
                                "url": member.user.displayAvatarURL(),
                            },
                            "author": {
                                "name": client.translate.events.guildMemberAdd.welcome,
                                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/video-game_1f3ae.png",
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
        catchError(client, member.guild.systemChannel, "guildMemberAdd", error);
    });
};