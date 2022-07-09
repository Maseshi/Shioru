const { getDatabase, ref, child, get, set } = require("firebase/database");
const settingsData = require("../../extras/settingsData");
const catchError = require("../../extras/catchError");

module.exports = (client, oldChannel, newChannel) => {
    if (client.mode === "start") {
        settingsData(client, newChannel.guild, module.exports, (oldChannel, newChannel));
        if (client.temp.set !== 1) return;
    }

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), newChannel.guild.id);

    get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.channelUpdate;

            if (notifyId) {
                const notification = newChannel.guild.channels.cache.find(channels => channels.id === notifyId);

                if (!notification) return;

                notification.send({
                    "embeds": [
                        {
                            "title": client.translate.events.channelUpdate.system_notification,
                            "description": client.translate.events.channelUpdate.member_update_channel.replace("%s1", oldChannel.name).replace("%s2", newChannel.id),
                            "timestamp": new Date(),
                            "color": 4886754,
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
                module.exports(client, oldChannel, newChannel);
            });
        }
    }).catch((error) => {
        catchError(client, newChannel, "channelUpdate", error);
    });
};