const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports = function (client, member) {
    if (member.user.bot) return;

	let guildId = member.guild.id;

    let ref = database().ref("Shioru/apps/discord/guilds").child(guildId);

    ref.child("config").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyId = snapshot.val().notification.guildMemberRemove;

            if (notifyId) {
				let notification = member.guild.channels.cache.find(channels => channels.id === notifyId);
				notification.send({
                    "embeds": [
                        {
                            "title": member.user.username,
                            "description": client.translate.events.guildMemberRemove.user_has_exited,
                            "timestamp": new Date(),
                            "color": 16777215,
                            "thumbnail": {
                                "url": member.user.displayAvatarURL(),
                            }
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
                module.exports(client, member);
            }).catch(function (error) {
                catchError(client, message, module.exports.help.name, error);
            });
        }
    }).catch(function (error) {
        catchError(client, message, module.exports.help.name, error);
    });
};