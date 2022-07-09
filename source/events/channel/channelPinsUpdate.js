const { getDatabase, ref, child, get, set } = require("firebase/database");
const settingsData = require("../../extras/settingsData");
const catchError = require("../../extras/catchError");

module.exports = (client, channel, time) => {
    if (client.mode === "start") {
        settingsData(client, channel.guild, module.exports, (channel, time));
        if (client.temp.set !== 1) return;
    }

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), channel.guild.id);

    get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.channelPinsUpdate;

            if (notifyId) {
                const notification = channel.guild.channels.cache.find(channels => channels.id === notifyId);

                if (!notification) return;
                
                notification.send({
                    "embeds": [
                        {
                            "title": client.translate.events.channelPinsUpdate.system_notification,
                            "description": client.translate.events.channelPinsUpdate.member_pins_in_channel.replace("%s1", channel.id).replace("%s2", time),
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
                module.exports(client, channel, time);
            });
        }
    }).catch((error) => {
		catchError(client, channel, "channelPinsUpdate", error);
	});
};