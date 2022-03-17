const { getDatabase, ref, child, get, set } = require("firebase/database");
const settingsData = require("../../extras/settingsData");
const catchError = require("../../extras/catchError");

module.exports = (client, oldEmoji, newEmoji) => {
    if (client.config.mode === "production") {
        settingsData(client, newEmoji, module.exports);
        if (client.config.worker !== 1) return;
    }

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), emoji.guild.id);

    get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.emojiUpdate;

            if (notifyId && notifyId !== 0) {
                const notification = newEmoji.guild.channels.cache.find(channels => channels.id === notifyId);

                if (!notification) return;

                notification.send({
                    "embeds": [
                        {
                            "title": client.translate.events.emojiUpdate.system_notification,
                            "description": client.translate.events.emojiUpdate.member_update_emoji.replace("%s1", oldEmoji.name).replace("%s2", newEmoji.name),
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
                    "alert": 0,
                    "channelCreate": 0,
                    "channelDelete": 0,
                    "channelPinsUpdate": 0,
                    "channelUpdate": 0,
                    "emojiCreate": 0,
                    "emojiDelete": 0,
                    "emojiUpdate": 0,
                    "guildMemberAdd": 0,
                    "guildMemberRemove": 0
                }
            }).then(() => {
                module.exports(client, oldEmoji, newEmoji);
            });
        }
    }).catch((error) => {
        catchError(client, newEmoji.guild.systemChannel, "emojiUpdate", error);
    });
};