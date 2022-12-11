const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set, remove, update } = require("firebase/database");
const { catchError } = require("./consoleUtils");

const chatSystem = async (client, message, mentioned, args) => {
    const childRef = ref(getDatabase(), "projects/shioru");
    const argument = message.content.replace(/^<@!?\d{1,20}> ?/i, "");

    // When the bot calls and asks some questions.
    if (argument) {
        message.channel.sendTyping();

        try {
            const chatSnapshot = client.api.chat;

            if (chatSnapshot) {
                const prompts = client.config.constants.prompts.concat(chatSnapshot.prompts);
                const replies = client.config.constants.replies.concat(chatSnapshot.replies);
                const alternative = client.config.constants.alternative.concat(chatSnapshot.alternative);

                const command = chatSnapshot.command;
                const script = chatSnapshot.script;

                // Remove all characters except word characters, space, and digits
                // 'tell me a story' -> 'tell me story'
                // 'i feel happy' -> 'happy'
                const text = argument.toLowerCase()
                    .replace(/ a /g, " ")
                    .replace(/pls/g, "please")
                    .replace(/i feel /g, "")
                    .replace(/whats/g, "what is")
                    .replace(/please /g, "")
                    .replace(/ please/g, "")
                    .replace(/r u/g, "are you");

                const compare = (promptsArray, repliesArray, commandArray, scriptArray, string) => {
                    let reply, command, script;
                    for (let x = 0; x < promptsArray.length; x++) {
                        for (let y = 0; y < promptsArray[x].length; y++) {
                            if (promptsArray[x][y] === string) {
                                let replies = repliesArray[x];
                                reply = replies[Math.floor(Math.random() * replies.length)];
                                break;
                            }
                        }
                        if (commandArray) {
                            for (let y = 0; y < commandArray[x].length; y++) {
                                if (commandArray[x][y] === string) {
                                    let commands = commandArray[x];
                                    command = commands[Math.floor(Math.random() * commands.length)];
                                    break;
                                }
                            }
                        }
                        if (scriptArray) {
                            for (let y = 0; y < scriptArray[x].length; y++) {
                                if (scriptArray[x][y] === string) {
                                    let scripts = scriptArray[x];
                                    script = scripts[Math.floor(Math.random() * scripts.length)];
                                    break;
                                }
                            }
                        }
                    }
                    return { reply, command, script };
                }

                if (compare(prompts, replies, command, script, text).reply) {
                    message.channel.send(compare(prompts, replies, command, script, text).reply);
                } else {
                    message.channel.send(alternative[Math.floor(Math.random() * alternative.length)]);
                }
                if (compare(prompts, replies, command, script, text).command) {
                    client.commands.get(compare(prompts, replies, command, script, text).command).run(client, message, args);
                }
                if (compare(prompts, replies, command, script, text).reply && compare(prompts, replies, command, script, text).script) {
                    // Script format on database: ((client, message, answer) => {})
                    // Script format when converted: ((client, message, answer) => {})(client, message, answer[randomWords])
                    const answerScript = await eval(compare(prompts, replies, command, script, text).script)(client, message, compare(prompts, replies, command, script, text).reply);

                    message.channel.send(answerScript);
                }
            } else {
                set(child(childRef, "chat"), {
                    "prompts": [
                        ["สวัสดี"]
                    ],
                    "replies": [
                        ["สวัสดีค่าา"]
                    ],
                    "alternative": [
                        "คืออะไรหรอ?"
                    ],
                    "commands": [[]],
                    "script": [[]]
                }).then(() => {
                    chatSystem(client, message, args);
                });
            }
        } catch (error) {
            catchError(client, message, "chatSystem", error);
        }
    }

    // When the bot is called by tagging.
    if (!argument && mentioned) {
        message.channel.sendTyping();

        try {
            const tagsSnapshot = client.api.chat.tags;

            if (tagsSnapshot) {
                const randomWords = Math.floor(Math.random() * tagsSnapshot.length);

                return message.channel.send(tagsSnapshot[randomWords]);
            } else {
                set(child(childRef, "chat/tags"), [
                    client.translate.utils.databaseUtils.was_mentioned
                ]).then(() => {
                    chatSystem(client, message, args);
                });
            }
        } catch (error) {
            catchError(client, message, "chatSystem", error);
        }
    }
};

const levelSystem = async (client, message, method, arg, amount) => {
    if (!client) return console.log("[levelSystem] Please configure CLIENT for localization (required).");
    if (!message) return console.log("[levelSystem] Please configure MESSAGE to make notifications and receive important basic information (required).");
    if (!method) return console.log("[levelSystem] Please specify a method to continue. (required).");

    const authorID = message.author ? message.author.id : message.user.id;
    const userID = method.includes(["GET", "DELETE"]) ? arg : authorID;
    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), message.guild.id);
    const guildUserRef = child(ref(getDatabase(), "projects/shioru/users"), userID);
    const guildUserSnapshot = client.api.users[userID];

    const notification = async (msg) => {
        const guildSnapshot = client.api.guilds[message.guild.id];
        const channelID = guildSnapshot.notification.alert;

        if (channelID) {
            if (typeof channelID === "boolean") {
                const channel = msg.guild.channels.cache.find(channels => channels.id === channelID);

                if (!channel) {
                    console.log("[levelSystem/notify] The specified notification channel could not be found.");
                    return false;
                } else {
                    return channel;
                }
            } else {
                await set(child(guildRef, "notification/alert"), true);

                notification(msg);
            }
        } else {
            return false;
        }
    };

    if (guildUserSnapshot) {
        let exp = guildUserSnapshot.leveling.exp;
        let level = guildUserSnapshot.leveling.level;
        const nextEXP = level * level * 100;

        if (exp >= nextEXP) {
            const alert = await notification(message);
            const authorUsername = message.author ? message.author.username : message.user.username;
            const authorAvatar = message.author ? message.author.displayAvatarURL() : message.user.displayAvatarURL();
            const levelSystemEmbed = new EmbedBuilder()
                .setTitle(client.translate.utils.databaseUtils.level_up.replace("%s1", authorUsername).replace("%s2", level))
                .setColor("Yellow")
                .setThumbnail(authorAvatar);

            await update(guildUserRef, {
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

                if (guildUserSnapshot) {
                    if (method === "GET") {
                        GETData = {
                            "exp": exp,
                            "level": level,
                            "nextEXP": nextEXP
                        };
                    }
                    if (method === "GET/ALL") {
                        GETData = client.api.users;
                    }
                }
                return GETData;
            case "POST":
                if (!arg) return console.log("[levelSystem/POST] Please specify the amount of experience.");

                update(child(guildUserRef, "leveling"), {
                    "exp": (exp += arg)
                });
                break;
            case "PUT":
                let PUTData = 0;
                let PUTStatus = "";
                let alert = await notification(message);

                try {
                    await update(child(child(ref(getDatabase(), "projects/shioru/users"), arg), "leveling"), {
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
                if (!guildUserSnapshot.leveling) return DELETEStatus = "missing";

                try {
                    await remove(child(child(ref(getDatabase(), "projects/shioru/users"), arg), "leveling"));
                    DELETEStatus = "success";
                } catch {
                    DELETEStatus = "error";
                }
                return DELETEStatus;
            default: console.log("[levelSystem/METHOD] " + method + " is not a valid method.");
        }
    } else {
        await set(guildUserRef, {
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

        levelSystem(client, message, method, arg, amount);
    }
}

const settingsData = (client, guild, exports, callback) => {
    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), guild.id);

    const notificationVerify = (guildRef, guildSnapshot) => {
        const notificationList = [
            "alert",
            "channelCreate",
            "channelDelete",
            "channelPinsUpdate",
            "channelUpdate",
            "emojiCreate",
            "emojiDelete",
            "emojiUpdate",
            "guildBanAdd",
            "guildBanRemove",
            "guildIntegrationsUpdate",
            "guildMemberAdd",
            "guildMemberRemove",
            "guildMembersChunk",
            "guildUnavailable",
            "inviteCreate",
            "inviteDelete",
            "roleCreate",
            "roleDelete",
            "roleUpdate",
            "stageInstanceCreate",
            "stageInstanceDelete",
            "stageInstanceUpdate",
            "stickerCreate",
            "stickerDelete",
            "stickerUpdate",
            "threadCreate",
            "threadDelete",
            "threadUpdate",
            "webhookUpdate"
        ];

        for (const notificationName in notificationList) {
            const position = notificationList.at(-1);

            if (guildSnapshot.notification) {
                const snapshot = guildSnapshot.notification[notificationName];

                if (typeof snapshot === "undefined") {
                    set(child(child(guildRef, "notification"), notificationName), false);
                }
                if (typeof snapshot !== "boolean") {
                    set(child(child(guildRef, "notification"), notificationName), snapshot ? true : false);
                }
                if (notificationName === position) {
                    return settingsData(client, guild, exports, callback);
                }
            } else {
                set(child(guildRef, "notification"), {
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
                    "guildIntegrationsUpdate": false,
                    "guildMemberAdd": false,
                    "guildMemberRemove": false,
                    "guildMembersChunk": false,
                    "guildUnavailable": false,
                    "inviteCreate": false,
                    "inviteDelete": false,
                    "roleCreate": false,
                    "roleDelete": false,
                    "roleUpdate": false,
                    "stageInstanceCreate": false,
                    "stageInstanceDelete": false,
                    "stageInstanceUpdate": false,
                    "stickerCreate": false,
                    "stickerDelete": false,
                    "stickerUpdate": false,
                    "threadCreate": false,
                    "threadDelete": false,
                    "threadUpdate": false,
                    "webhookUpdate": false
                }).then(() => {
                    return settingsData(client, guild, exports, callback);
                });
            }
        }
    };

    if (!client.api.guilds[guild.id]) {
        set(guildRef, {
            "prefix": client.config.prefix,
            "language": client.config.language.code
        });

        return notificationVerify(guildRef, client.api.guilds[guild.id]);
    }

    const guildSnapshot = client.api.guilds[guild.id];

    if (!guildSnapshot.prefix) {
        return set(child(guildRef, "prefix"), client.config.prefix).then(() => settingsData(client, guild, exports, callback));
    }
    if (!guildSnapshot.language) {
        return set(child(guildRef, "language"), client.config.language.code).then(() => settingsData(client, guild, exports, callback));
    }
    if (!guildSnapshot.notification) {
        return notificationVerify(guildRef, guildSnapshot);
    }

    notificationVerify(guildRef, guildSnapshot);

    client.config.prefix = guildSnapshot.prefix;
    client.config.language.code = guildSnapshot.language;
    client.translate = require("../languages/" + guildSnapshot.language + ".json");

    if (!client.temp.set) {
        client.temp.set = 1;
        return exports(client, callback);
    }
}

module.exports = {
    chatSystem,
    levelSystem,
    settingsData
}
