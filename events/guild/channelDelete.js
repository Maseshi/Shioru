const firebase = require("firebase");

module.exports = function (client, channel) {
    let guildId = channel.guild.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(guildId);

    ref.child("config/notification").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyId = snapshot.val().channelDelete;

            if (notifyId) {
                let guild = client.guilds.cache.find(servers => servers.id === channel.guild.id);
                let notification = guild.channels.cache.find(channels => channels.id === notifyId);
                notification.send({
                    "embed": {
                        "description": "> " + client.lang.event_guild_channelDelete_embed_description.replace("%channel", channel.name),
                        "timestamp": new Date(),
                        "color": 4886754,
                        "footer": {
                            "text": client.lang.event_guild_channelCreate_embed_footer_text
                        },
                        "author": {
                            "name": client.lang.event_guild_notification_way_system,
                            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bell_1f514.png"
                        }
                    }
                });
            }
        } else {
            ref.child("config/notification").update({
                "channelDelete": 0
            }).then(function () {
                module.exports(client, message, args);
            });
        }
    });
};