const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports = function (client, member) {
    if (member.user.bot) return;

	let guildId = member.guild.id;

    let ref = database().ref("Shioru/apps/discord/guilds").child(guildId);

    ref.child("config").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyId = snapshot.val().notification.guildMemberAdd;

            if (notifyId && notifyId !== 0) {
				let notification = member.guild.channels.cache.find(channels => channels.id === notifyId);
                notification.send({
                    "embeds": [
                        {
                            "title": member.user.tag,
                            "description": client.translate.events.guildMemberAdd.greet,
                            "timestamp": new Date(),
                            "color": 16777215,
                            "thumbnail": {
                                "url": member.user.displayAvatarURL(),
                            },
                            "author": {
                                "name": client.translate.events.guildMemberAdd.welcome,
                                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/video-game_1f3ae.png",
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