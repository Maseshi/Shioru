const firebase = require("firebase");

module.exports = function (client, member) {
	let guildId = member.guild.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/Discord/Guilds/").child(guildId);
    ref.once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyEnable = snapshot.val().channels.notification.enable;
            let notifyId = snapshot.val().channels.notification.id;

            if (notifyEnable === true) {
				let notification = member.guild.channels.cache.find(ch => ch.id === notifyId);
				if (member.user.bot) {
					return;
				} else {
					notification.send({
                        "embed": {
                            "title": member.user.tag,
                            "description": client.lang.event_guild_guildMemberAdd_embed_description,
                            "timestamp": new Date(),
                            "color": 16777215,
                            "thumbnail": {
                                "url": member.user.displayAvatarURL(),
                            },
                            "author": {
                                "name": client.lang.event_guild_guildMemberAdd_embed_author_name,
                                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/video-game_1f3ae.png",
                            }
					    }
                    });
				}
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