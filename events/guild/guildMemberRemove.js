const firebase = require("firebase");

module.exports = function (client, member) {
	let guildId = member.guild.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(guildId);

    ref.child("config/notification").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyId = snapshot.val().guildMemberRemove;

            if (notifyId) {
				let notification = member.guild.channels.cache.find(channels => channels.id === notifyId);
				if (member.user.bot) return;
				notification.send({
                    "embed": {
                        "title": member.user.username,
                        "description": client.lang.event_guild_guildMemberRemove_embed_description,
                        "timestamp": new Date(),
                        "color": 16777215,
                        "thumbnail": {
                            "url": member.user.displayAvatarURL(),
                        }
                    }
                });
            }
        } else {
            ref.child("config/notification").update({
                "guildMemberRemove": 0
            }).then(function () {
                module.exports(client, message, args);
            });
        }
    });
};