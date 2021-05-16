const firebase = require("firebase");

module.exports = function (client, message) {
    let guild = message.guild.id;
    
    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(guild);

    ref.child("config").once("value").then(function(snapshot) {
        const msgEvent = require("../events/client/message");
        
        if (snapshot.exists()) {
            let prefix = snapshot.val().prefix;
            let lang = snapshot.val().language;
            
            if (lang !== client.lang) {
                const applyLang = require("../languages/" + lang + ".json");
                client.lang = applyLang;
            }
            if (prefix !== client.config.prefix) {
                client.config.prefix = prefix;
                return msgEvent(client, message);
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