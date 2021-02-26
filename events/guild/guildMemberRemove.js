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
					const embed = {
						"title": member.user.username,
						"description": client.lang.event_guild_guildMemberRemove_embed_description,
                        "timestamp": new Date(),
						"color": 16777215,
						"thumbnail": {
							"url": member.user.displayAvatarURL(),
						}
					};
					notification.send({ embed });
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