const { getDatabase, ref, child, get, set, remove, update } = require("firebase/database");

module.exports = async (client, message, method, arg, amount) => {
    if (!client) return console.log("levelSystem: Please configure CLIENT for localization (required).");
    if (!message) return console.log("levelSystem: Please configure MESSAGE to make notifications and receive important basic information (required).");
    if (!method) return console.log("levelSystem: Please specify a method to continue. (required).");

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds/"), message.guild.id);
    const userID = (method === "GET") || (method === "DELETE") ? (arg || message.author.id) : message.author.id;
    const snapshot = await get(child(child(childRef, "data/users"), userID));

    const notification = async (message) => {
        const config = await get(child(childRef, "config"));

        if (!config.exists()) {
            await set(child(childRef, "config"), {
                "prefix": "S",
                "language": "en",
                "notification": {
                    "alert": 0,
                    "channelCreate": 0,
                    "channelDelete": 0,
                    "channelPinsUpdate": 0,
                    "channelUpdate": 0,
                    "emojiCreate": 0,
                    "emojiDelete": 0,
                    "emojiUpdate": 0,
                    "guildMemberAdd": 0,
                    "guildMemberRemove": 0
                }
            });

            notify(message);
        } else {
            const notifyID = config.val().notification.alert;

            if (notifyID && notifyID !== 0) {
                const channel = message.guild.channels.cache.find(channels => channels.id === notifyID);

                if (!channel) {
                    console.log("notify: The specified notification channel could not be found.");
                    return 0;
                } else {
                    return channel;
                }
            } else {
                return 0;
            }
        }
    };

    if (!snapshot.exists()) {
        await set(child(child(childRef, "data/users"), userID), {
            "access": {
                "avatar": true,
                "info": true,
                "uid": true
            },
            "leveling": {
                "exp": 0,
                "level": 0
            }
        });

        module.exports(client, message, method, arg, amount);
    } else {
        let exp = snapshot.val().leveling.exp;
        let level = snapshot.val().leveling.level;
        const nextEXP = level * level * 100;

        if (exp >= nextEXP) {
            const alert = await notification(message);
            const authorUsername = message.author.username;
            const authorAvatar = message.author.displayAvatarURL();

            await update(child(child(childRef, "data/users"), userID), {
                "leveling": {
                    "exp": (exp -= nextEXP),
                    "level": ++level
                }
            });

            if (alert) alert.send({
                "embeds": [
                    {
                        "description": client.translate.extras.levelSystem.level_up.replace("%s1", authorUsername).replace("%s2", level),
                        "color": 16312092,
                        "thumbnail": {
                            "url": authorAvatar
                        }
                    }
                ]
            });
        }

        switch (method) {
            case "GET":
            case "GET/ALL":
                let GETData = 0;

                if (snapshot.exists()) {
                    if (method === "GET") GETData = {
                        "exp": exp,
                        "level": level,
                        "nextEXP": nextEXP
                    };
                    if (method === "GET/ALL") GETData = await get(child(childRef, "data/users"));
                }
            return GETData;
            case "POST":
                if (!arg) return console.log("levelSystem/POST: Please specify the amount of experience.");
                
                update(child(child(child(childRef, "data/users"), userID), "leveling"), {
                    "exp": (exp += arg)
                });
            break;
            case "PUT":
                let PUTData = 0;
                let PUTStatus = "";
                let alert = await notification(message);

                try {
                    await update(child(child(child(childRef, "data/users"), arg), "leveling"), {
                        "exp": amount
                    });
                    PUTStatus = "success";
                } catch {
                    PUTStatus = "error";
                }

                PUTData = {
                    "level": level,
                    "exp": amount,
                    "notify": alert,
                    "status": PUTStatus
                }
            return PUTData;
            case "DELETE":
                let DELETEStatus = "";

                if (!arg) return console.log("levelSystem/DELETE: Please enter the user ID you wish to delete experience data for.");
                if (!snapshot.val().leveling) return DELETEStatus = "missing";

                try {
                    await remove(child(child(child(childRef, "data/users"), arg), "leveling"));
                    DELETEStatus = "success";
                } catch {
                    DELETEStatus = "error";
                }
            return DELETEStatus;
            default: console.log("levelSystem/METHOD: " + method + " is not a valid method.");
        }
    }
};