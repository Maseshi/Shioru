const { getDatabase, ref, child, onValue, set } = require("firebase/database");
const catchError = require("./catchError");

module.exports = (client, data, exports) => {
    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), (data.guild.id || data.id));

    onValue(child(childRef, "config"), (snapshot) => {
        if (snapshot.exists()) {
            const prefix = snapshot.val().prefix;
            const lang = snapshot.val().language;
            
            client.config.prefix = prefix;
            client.config.lang.code = lang;
            client.translate = require("../languages/" + lang + ".json");
            if (!client.config.worker) {
                client.config.worker = 1;
                return exports(client, data);
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
                module.exports(client, data);
            }).catch((error) => {
                catchError(client, data, "settingsData", error);
            });
        }
    });
};