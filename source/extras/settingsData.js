const { database } = require("firebase");
const catchError = require("./catchError");

module.exports = function(client, message, exports) {
    let ref = database().ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("config").on("value", function(snapshot) {   
        if (snapshot.exists()) {
            let prefix = snapshot.val().prefix;
            let lang = snapshot.val().language;
            
            client.config.prefix = prefix;
            client.config.lang.code = lang;
            client.translate = require("../languages/" + lang + ".json");
            if (!client.config.worker) {
                client.config.worker = 1;
                return exports(client, message);
            }
        } else {
            ref.child("config").set({
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
            }, function(error) {
                if (error) return catchError(client, message, "settingsData", error);
                module.exports(client, message);
            });
        }
    });
};