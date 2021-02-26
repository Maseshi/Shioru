const firebase = require("firebase");

module.exports = function (client, message) {
    let guild = message.guild.id;
    
    let database = firebase.database();
    let ref = database.ref("Shioru/Discord/Guilds/").child(guild);

    ref.on("value", function (snapshot) {
        const messages = require("../events/client/message");

        if (snapshot.exists()) {
            let prefix = snapshot.val().prefix;
            let lang = snapshot.val().language;
            let notifyId = snapshot.val().channels.notification.id;
            let notifyEnable = snapshot.val().channels.notification.enable;
            
            if (lang !== client.lang) {
                const applyLang = require("../languages/" + lang + ".json");
                client.lang = applyLang;
            }
            if (prefix !== client.config.prefix) {
                client.config.prefix = prefix;
                messages(client, message);
            }
        } else {
            ref.set({
                "prefix": "S",
                "language": "th_TH",
                "channels": {
                    "notification": {
                        "enable": false,
                        "id": 0
                    }
                }
            }).then(function () {
                messages(client, message);
            });
        }
    });
};