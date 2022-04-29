const { getDatabase, ref, child, onValue, set } = require("firebase/database");
const catchError = require("./catchError");

module.exports = (client, guild, exports) => {
    const childRef = child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guild.id);

    onValue(child(childRef, "config"), (snapshot) => {
        if (snapshot.exists()) {
            const prefix = snapshot.val().prefix;
            const lang = snapshot.val().language;
            
            client.config.prefix = prefix;
            client.config.lang.code = lang;
            client.translate = require("../languages/" + lang + ".json");
            if (!client.temp.set) {
                client.temp.set = 1;
                return exports(client, guild);
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
                module.exports(client, data);
            }).catch((error) => {
                catchError(client, guild, "settingsData", error);
            });
        }
    });
};