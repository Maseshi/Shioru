const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, onValue, get, set, remove, update } = require("firebase/database");
const { catchError } = require("./consoleUtils");

const chatSystem = (client, message, mentioned, args) => {
    const db = getDatabase();
    const childRef = ref(db, "Shioru/data");
    const argument = message.content.replace(/^<@!?\d{1,20}> ?/i, '');

    // When the bot calls and asks some questions.
    if (argument) {
        message.channel.sendTyping();

        onValue(child(child(child(childRef, "words/messages"), client.config.language.default), argument)).then(async (snapshot) => {
            if (snapshot.exists()) {
                const answer = snapshot.val().answer;
                const command = snapshot.val().command;
                const script = snapshot.val().script;

                if (command) {
                    client.commands.get(command).run(client, message, args);
                }
                if (answer && script) {
                    const randomWords = Math.floor(Math.random() * answer.length);

                    // Script format on database: ((client, message, answer) => {})
                    // Script format when converted: ((client, message, answer) => {})(client, message, answer[randomWords])
                    const answerScript = await eval(script)(client, message, answer[randomWords]);

                    message.channel.send(answerScript);
                }
                if (!script && answer) {
                    const randomWords = Math.floor(Math.random() * answer.length);

                    message.channel.send(answer[randomWords]);
                }
            } else {
                set(child(child(child(childRef, "words/messages"), client.config.language.default), argument), {
                    "answer": [
                        client.translate.extras.chatSystem.empty_answer
                    ],
                    "command": false,
                    "script": false
                });
                return message.channel.send(client.translate.extras.chatSystem.do_not_understand);
            }
        }).catch((error) => {
            catchError(client, message, "chatSystem", error);
        })
    }

    // When the bot is called by tagging.
    if (!argument && mentioned) {
        message.channel.sendTyping();

        onValue(child(child(childRef, "words/tags"), client.config.language.default)).then((snapshot) => {
            if (snapshot.exists()) {
                const tags = snapshot.val();

                const randomWords = Math.floor(Math.random() * tags.length);

                return message.channel.send(tags[randomWords]);
            } else {
                set(child(child(childRef, "words/tags"), client.config.language.default), [
                    client.translate.extras.chatSystem.was_mentioned
                ]).then(() => {
                    module.exports(client, message, args);
                });
            }
        }).catch((error) => {
            catchError(client, message, "chatSystem", error);
        });
    }
};

const levelSystem = (client, message, method, arg, amount) => {
    if (!client) return console.log("[levelSystem] Please configure CLIENT for localization (required).");
    if (!message) return console.log("[levelSystem] Please configure MESSAGE to make notifications and receive important basic information (required).");
    if (!method) return console.log("[levelSystem] Please specify a method to continue. (required).");

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds/"), message.guild.id);
    const channelRef = child(childRef, "config/notification/alert");
    const authorID = message.author ? message.author.id : message.user.id;
    const userID = method === "GET" || method === "DELETE" ? arg || authorID : authorID;
    const userRef = child(child(childRef, "data/users"), userID);

    const notification = (msg) => {
        get(child(childRef, "config")).then(async snapshot => {
            if (!snapshot.exists()) {
                const notifyId = snapshot.val();

                if (notifyId && notifyId !== 0 && notifyId !== false) {
                    const channel = msg.guild.channels.cache.find(channels => channels.id === notifyId);

                    if (!channel) {
                        console.log("[levelSystem/notify] The specified notification channel could not be found.");
                        return false;
                    } else {
                        return channel;
                    }
                } else {
                    return false;
                }
            } else {
                await set(channelRef, false);

                notification(msg);
            }
        });
    };

    get(userRef).then(async snapshot => {
        if (snapshot.exists()) {
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;
            const nextEXP = level * level * 100;

            if (exp >= nextEXP) {
                const alert = await notification(message);
                const authorUsername = message.author ? message.author.username : message.user.username;
                const authorAvatar = message.author ? message.author.displayAvatarURL() : message.user.displayAvatarURL();
                const levelSystemEmbed = new EmbedBuilder()
                    .setTitle(client.translate.extras.levelSystem.level_up.replace("%s1", authorUsername).replace("%s2", level))
                    .setColor("Yellow")
                    .setThumbnail(authorAvatar);

                await update(userRef, {
                    "leveling": {
                        "exp": (exp -= nextEXP),
                        "level": ++level
                    }
                });

                if (alert) alert.send({ "embeds": [levelSystemEmbed] });
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
                    if (!arg) return console.log("[levelSystem/POST] Please specify the amount of experience.");

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

                    if (!arg) return console.log("[levelSystem/DELETE] Please enter the user ID you wish to delete experience data for.");
                    if (!snapshot.val().leveling) return DELETEStatus = "missing";

                    try {
                        await remove(child(child(child(childRef, "data/users"), arg), "leveling"));
                        DELETEStatus = "success";
                    } catch {
                        DELETEStatus = "error";
                    }
                    return DELETEStatus;
                default: console.log("[levelSystem/METHOD] " + method + " is not a valid method.");
            }
        } else {
            await set(userRef, {
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
        }
    });
}

const settingsData = (client, guild, exports, callback) => {
    const childRef = child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guild.id);

    onValue(child(childRef, "config"), (snapshot) => {
        if (snapshot.exists()) {
            const prefix = snapshot.val().prefix;
            const lang = snapshot.val().language;
            
            client.config.prefix = prefix;
            client.config.language.default = lang;
            client.translate = require("../languages/" + lang + ".json");
            if (!client.temp.set) {
                client.temp.set = 1;
                return exports(client, callback);
            }
        } else {
            const prefix = client.config.prefix;
            const lang = client.config.language.default;

            set(child(childRef, "config"), {
                "prefix": prefix,
                "language": lang,
                "notification": {
                    "alert": false,
                    "channelCreate": false,
                    "channelDelete": false,
                    "channelPinsUpdate": false,
                    "channelUpdate": false,
                    "emojiCreate": false,
                    "emojiDelete": false,
                    "emojiUpdate": false,
                    "guildBanAdd": false,
                    "guildBanRemove": false,
                    "guildMemberAdd": false,
                    "guildMemberRemove": false
                }
            }).then(() => {
                module.exports(client, guild, exports, callback);
            }).catch((error) => {
                catchError(client, guild, "settingsData", error);
            });
        }
    });
}

module.exports = {
    chatSystem,
    levelSystem,
    settingsData
}