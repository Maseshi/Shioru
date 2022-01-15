const { getDatabase, ref, child, get, set, update } = require("firebase/database");
const catchError = require("./catchError");

module.exports = (client, message) => {
    const username = message.author.username;
    const avatar = message.author.displayAvatarURL();

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds/"), message.guild.id);
    get(child(child(childRef, "data/users"), message.author.id)).then((snapshot) => {
        if (snapshot.exists()) {
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;

            if (exp >= 1000) {
                update(child(child(childRef, "data/users"), message.author.id), {
                    "leveling": {
                        "exp": 0,
                        "level": ++level
                    }
                }).then(() => {
                    get(child(childRef, "config")).then((snapshotData) => {
                        const notifyId = snapshotData.val().notification.alert;

                        if (snapshotData.exists()) {
                            if (notifyId && notifyId !== 0) {
                                const channel = message.guild.channels.cache.find(channels => channels.id === notifyId);

                                channel.send({
                                    "embeds": [{
                                        "description": client.translate.events.levelSystem.level_up.replace("%s1", username).replace("%s2", level),
                                        "color": 16312092,
                                        "thumbnail": {
                                            "url": avatar
                                        }
                                    }]
                                });
                            }
                        } else {
                            update(child(childRef, "config/notification"), {
                                "alert": 0,
                                "channelCreate": 0,
                                "channelDelete": 0,
                                "channelPinsUpdate": 0,
                                "channelUpdate": 0,
                                "emojiCreate": 0,
                                "guildMemberAdd": 0,
                                "guildMemberRemove": 0
                            }).then(() => {
                                module.exports(client, message);
                            });
                        }
                    });
                });
            } else {
                update(child(child(child(childRef, "data/users"), message.author.id), "leveling"), {
                    "exp": (exp += 5)
                });
            }
        } else {
            set(child(child(childRef, "data/users"), message.author.id), {
                "access": {
                    "avatar": false,
                    "info": false,
                    "uid": false
                },
                "leveling": {
                    "exp": 0,
                    "level": 0
                }
            }).then(() => {
                module.exports(client, message);
            });
        }
    }).catch((error) => {
        catchError(client, message, "levelSystem", error);
    });
};