const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports = function (client, oldChannel, newChannel) {
    let guildId = newChannel.guild.id;

    let ref = database().ref("Shioru/apps/discord/guilds").child(guildId);

    ref.child("config").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyId = snapshot.val().notification.channelUpdate;

            if (notifyId && notifyId !== 0) {
                let guild = client.guilds.cache.find(servers => servers.id === guildId);
                let notification = guild.channels.cache.find(channels => channels.id === notifyId);
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
            }).then(function () {
                module.exports(client, oldChannel, newChannel);
            }).catch(function (error) {
                catchError(client, message, module.exports.help.name, error);
            });
        }
    }).catch(function (error) {
        catchError(client, message, module.exports.help.name, error);
    });
};