const firebase = require("firebase");

module.exports = function (client, message, exports) {
    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("config").once("value").then(function(snapshot) {   
        if (snapshot.exists()) {
            let prefix = snapshot.val().prefix;
            let lang = snapshot.val().language;
            
            if (lang !== client.data.language) client.data.language = require("../languages/" + lang + ".json");
            if (prefix !== client.data.config.client.prefix) {
                client.data.config.client.prefix = prefix
                client.data.working = 1;
                return exports(client, message);
            }
        } else {
            ref.child("config").set({
                "prefix": "S",
                "language": "th_TH",
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
            }).then(function() {
                module.exports(client, message);
            });
        }
    });
};