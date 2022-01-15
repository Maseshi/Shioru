const { getDatabase, ref, child, get, set } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports = (client, channel, time) => {
    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), channel.guild.id);

    get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val().notification.channelPinsUpdate;

            if (notifyId && notifyId !== 0) {
                const guild = client.guilds.cache.find(servers => servers.id === guildId);
                const notification = guild.channels.cache.find(channels => channels.id === notifyId);
                
                notification.send({
                    "embeds": [
                        {
                            "title": client.translate.events.channelPinsUpdate.system_notification,
                            "description": client.translate.events.channelPinsUpdate.member_pins_in_channel.replace("%s1", channel.id).replace("%s2", time),
                            "timestamp": new Date(),
                            "color": 4886754
                        }
                    ]
                });
            }
        } else {
            set(child(childRef, "config"), {
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
            }).then(() => {
                module.exports(client, channel, time);
            });
        }
    }).catch((error) => {
		catchError(client, message, "channelPinsUpdate", error);
	});
};