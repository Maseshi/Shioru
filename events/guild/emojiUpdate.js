const firebase = require("firebase");

module.exports = function (client, oldEmoji, newEmoji) {
    let guildId = newEmoji.guild.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/Discord/Guilds/").child(guildId);
    ref.once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyEnable = snapshot.val().channels.notification.enable;
            let notifyId = snapshot.val().channels.notification.id;

            if (notifyEnable === true) {
                let guild = client.guilds.cache.find(servers => servers.id === guildId);
                let notification = guild.channels.cache.find(ch => ch.id === notifyId);
                let embed = {
                    "description": client.lang.event_guild_emojiUpdate_embed_description.replace("%oldEmoji", oldEmoji.name).replace("%newEmoji", newEmoji.name),
                    "timestamp": new Date(),
                    "color": 4886754,
                    "author": {
                        "name": client.lang.event_guild_notification_way_system,
                        "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bell_1f514.png"
                    }
                };
                notification.send({ embed });
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
                module.exports(client, message, args);
            });
        }
    });
};