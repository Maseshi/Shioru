const firebase = require("firebase");

module.exports = function (client, emoji) {
	let guildId = emoji.guild.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(guildId);

    ref.child("config").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let notifyId = snapshot.val().notification.emojiCreate;

            if (notifyId) {
				let guild = client.guilds.cache.find(servers => servers.id === guildId);
				let notification = guild.channels.cache.find(channels => channels.id === notifyId);
				notification.send({
                    "embed": {
                        "title": client.data.language.event_guild_notification_way_system,
                        "description": ">" + client.data.language.event_guild_emojiCreate_embed_description.replace("%emoji", emoji.name),
                        "timestamp": new Date(),
                        "color": 4886754
                    }
                });
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
            }).then(function () {
                module.exports(client, emoji);
            });
        }
    });
};