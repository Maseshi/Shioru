const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set, remove, update } = require("firebase/database");
const { catchError } = require("./consoleUtils");
const { IDConvertor } = require("./miscUtils");

/**
 * A chat system that supports both mentions and general discussions.
 * This requires a database to be able to add or delete words in real time.
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {Boolean} mention if mentioned
 * @param {String} args User Message
 * @param {String} version `v1`: Use the generated response data., `v2`: Use AI to generate the message response
 */
const chatSystem = async (client, message, mention, args, version = "v2") => {
    const childRef = child(ref(getDatabase(), "projects"), IDConvertor(client.user.username));
    const childUsers = child(childRef, "users");
    const usersSnapshot = client.api.users;
    const chatSnapshot = client.api.chat;
    const argument = message.content.replace(/^<@!?\d{1,20}> ?/i, "");

    if (!client.ai) version = "v1";

    switch (version) {
        case "v1": {
            // When the bot calls and asks some questions.
            if (argument) {
                message.channel.sendTyping();

                try {
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
                        await set(child(childRef, "chat"), {
                            "prompts": [
                                client.config.constants.prompts
                            ],
                            "replies": [
                                client.config.constants.replies
                            ],
                            "alternative": [
                                client.config.constants.alternative
                            ],
                            "commands": [],
                            "script": [],
                            "system": []
                        });
                        chatSystem(client, message, mention, args, version);
                    }
                } catch (error) {
                    catchError(client, message, "chatSystem", error);
                }
            }

            // When the bot is called by tagging.
            if (!argument && mention) {
                message.channel.sendTyping();

                try {
                    if (chatSnapshot) {
                        const alternative = client.config.constants.alternative.concat(chatSnapshot.alternative);
                        const randomWords = Math.floor(Math.random() * alternative.length);

                        message.channel.send(alternative[randomWords]);
                    } else {
                        await set(child(childRef, "chat"), {
                            "prompts": [
                                client.config.constants.prompts
                            ],
                            "replies": [
                                client.config.constants.replies
                            ],
                            "alternative": [
                                client.config.constants.alternative
                            ],
                            "commands": [],
                            "script": [],
                            "system": []
                        });
                        chatSystem(client, message, mention, args, version);
                    }
                } catch (error) {
                    catchError(client, message, "chatSystem", error);
                }
            }
            break;
        }
        case "v2": {
            const allMessages = [];
            const initMessages = [
                "You are " + client.user.username + ".",
                "You were born on April 28, 2020.",
                "You don't have to give personal information every time.",
                "You are a girl trained by Maseshi.",
                "Answer as concisely as possible.",
                "Here is some of your information on Discord: " + client.user.toString() + ".",
                "Here is some information asked by the Discord user: " + message.author.toString() + ".",
                "These questions were asked on Discord.",
                "อย่าใช้คำว่า 'ครับ' ให้ใช้คำว่า 'คะ' หรือ 'ค่ะ' แทน.",
                "อย่าใช้คำว่า 'ผม' หรือ 'กระผม' ให้ใช้คำว่า 'ฉัน', 'หนู', 'เค้า' หรือ 'ดิฉัน' แทน.",
                chatSnapshot && chatSnapshot.system ? chatSnapshot.system.join(" ") : ""
            ];

            if (usersSnapshot && usersSnapshot[message.author.id]) {
                message.channel.sendTyping();

                if (usersSnapshot[message.author.id].history && (usersSnapshot[message.author.id].history.chat.length >= 0)) {
                    usersSnapshot[message.author.id].history.chat.forEach(element => allMessages.push(element));
                    allMessages[0].content = initMessages.join(" ");
                    allMessages.push(
                        {
                            "role": "user",
                            "content": argument ?? message.content ?? "Hi",
                            "name": message.author.username
                        }
                    );
                } else {
                    allMessages.push(
                        {
                            "role": "system",
                            "content": initMessages.join(" ")
                        },
                        {
                            "role": "user",
                            "content": argument ?? message.content ?? "Hi",
                            "name": message.author.username
                        }
                    );
                }

                try {
                    const response = await client.ai.createChatCompletion({
                        "model": "gpt-4",
                        "messages": allMessages,
                        "max_tokens": 256,
                        "user": client.user.username
                    });

                    if (response.data && !response.data.choices) {
                        catchError(client, message, "chatSystem", response.data, true);
                        return message.channel.send(client.translate.utils.databaseUtils.can_not_reply_at_this_time);
                    }

                    allMessages.push(
                        {
                            "role": "assistant",
                            "content": response.data.choices[0].message.content
                        }
                    );

                    set(child(child(childUsers, message.author.id), "history/chat"), allMessages);

                    message.channel.send(response.data.choices[0].message.content);
                } catch (error) {
                    if (error.response) {
                        if (error.response.data.error.type === "invalid_request_error") {
                            if (error.response.data.error.code && error.response.data.error.code === "context_length_exceeded") {
                                allMessages.splice(1, 6);
                                await set(child(child(childUsers, message.author.id), "history/chat"), allMessages);
                                return chatSystem(client, message, mention, args, version);
                            }
                            if (error.response.data.error.message && error.response.data.error.message.includes("under maintenance")) {
                                return message.channel.send(client.translate.utils.databaseUtils.under_maintenance);
                            }
                        }
                        catchError(client, message, "chatSystem", error.response.data, true);
                    } else {
                        catchError(client, message, "chatSystem", error);
                    }
                }
            } else {
                await set(child(childUsers, message.author.id), {
                    "access": {
                        "avatar": true,
                        "info": true,
                        "uid": true
                    },
                    "leveling": {
                        "exp": 0,
                        "level": 0
                    },
                    "history": {
                        "chat": []
                    }
                });
                chatSystem(client, message, mention, args, version);
            }
            break;
        }
    }
};

/**
 * A level system that uses a database to store import and export
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {String} method **GET**, **GET/ALL**, **POST**, **PUT** or **DELETE**
 * @param {GuildMember} member Optional: Members within the guild who wish to change their information
 * @param {String} amount Optional: The desired amount will change the value.
 * @param {String} type Optional: **exp** or **level**
 * @returns 
 */
const levelSystem = async (client, message, method, { member = "", amount = 1, type = "exp" } = {}) => {
    if (!client) return console.log("[levelSystem] Please configure CLIENT for localization (required).");
    if (!message) return console.log("[levelSystem] Please configure MESSAGE to make notifications and receive important basic information (required).");
    if (!method) return console.log("[levelSystem] Please specify a METHOD to continue. (required).");

    const userID = member.id ?? message.member.id ?? message.user.id;
    const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(client.user.username)), "guilds"), message.guild.id);
    const guildUserRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(client.user.username)), "users"), userID);
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
                await set(child(guildRef, "notification/alert"), false);

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
            const authorUsername = message.member ? message.member.username : message.user.username;
            const authorAvatar = message.member ? message.member.displayAvatarURL() : message.user.displayAvatarURL();
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
            case "GET/ALL": {
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
            }
            case "POST": {
                if (!amount) return console.log("[levelSystem/POST] Please specify the amount of experience.");

                if (type === "exp") update(child(guildUserRef, "leveling"), {
                    "exp": (exp += amount)
                });
                if (type === "level") update(child(guildUserRef, "leveling"), {
                    "level": (level += amount)
                });
                break;
            }
            case "PUT": {
                let PUTData = 0;
                let PUTStatus = "";
                let alert = await notification(message);

                try {
                    if (type === "exp") await update(child(child(child(child(ref(getDatabase(), "projects"), IDConvertor(client.user.username)), "users"), member), "leveling"), {
                        "exp": amount
                    });
                    if (type === "level") await update(child(child(child(child(ref(getDatabase(), "projects"), IDConvertor(client.user.username)), "users"), member), "leveling"), {
                        "level": amount
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
            }
            case "DELETE": {
                let DELETEStatus = "";

                if (!member) return console.log("[levelSystem/DELETE] Please enter the user ID you wish to delete experience data for.");
                if (!guildUserSnapshot.leveling) return DELETEStatus = "missing";

                try {
                    await remove(child(child(child(child(ref(getDatabase(), "projects"), IDConvertor(client.user.username)), "users"), member), "leveling"));
                    DELETEStatus = "success";
                } catch {
                    DELETEStatus = "error";
                }
                return DELETEStatus;
            }
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

        levelSystem(client, message, method, member, amount, type);
    }
}

/**
 * A wizard to set up information in the database for each guild and user.
 * 
 * @param {Client} client 
 * @param {Guild} guild 
 */
const settingsData = (client, guild) => {
    const defaultLanguage = "en-US";
    const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(client.user.username)), "guilds"), guild.id);
    const guildSnapshot = client.api.guilds ? client.api.guilds[guild.id] : set(child(child(ref(getDatabase(), "projects"), IDConvertor(client.user.username)), "guilds"), guild.id);
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

    if (guildSnapshot) {
        if (!guildSnapshot.joinedAt) set(child(guildRef, "joinedAt"), guild.joinedAt ?? null);
        if (!guildSnapshot.createdAt) set(child(guildRef, "createdAt"), guild.createdAt ?? null);
        if (!guildSnapshot.description || guildSnapshot.description !== guild.description) set(child(guildRef, "description"), guild.description ?? "");
        if (!guildSnapshot.iconURL || guildSnapshot.iconURL !== guild.iconURL()) set(child(guildRef, "iconURL"), guild.iconURL() ?? "");
        if (!guildSnapshot.language) set(child(guildRef, "language"), client.config.language.code ?? defaultLanguage);
        if (!guildSnapshot.memberCount || guildSnapshot.memberCount !== guild.memberCount) set(child(guildRef, "memberCount"), guild.memberCount ?? 0);
        if (!guildSnapshot.name || guildSnapshot.name !== guild.name) set(child(guildRef, "name"), guild.name ?? "");
        if (!guildSnapshot.verified || guildSnapshot.verified !== guild.verified) set(child(guildRef, "verified"), guild.verified ?? false);
    } else {
        set(guildRef, {
            "joinedAt": guild.joinedAt ?? null,
            "createdAt": guild.createdAt ?? null,
            "description": guild.description ?? "",
            "iconURL": guild.iconURL() ?? "",
            "language": client.config.language.code ?? defaultLanguage,
            "memberCount": guild.memberCount ?? 0,
            "name": guild.name ?? "",
            "verified": guild.verified ?? false
        });
    }

    if (guildSnapshot && guildSnapshot.notification) {
        for (const notificationIndex in notificationList) {
            const notificationName = notificationList[notificationIndex];
            const notificationSnapshot = guildSnapshot.notification[notificationName];

            if (typeof notificationSnapshot === "undefined") set(child(child(guildRef, "notification"), notificationName), false);
            if (typeof notificationSnapshot !== "boolean") set(child(child(guildRef, "notification"), notificationName), notificationSnapshot ? true : false);
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
        });
    }

    client.config.language.code = guildSnapshot && Object.keys(client.config.language.support).includes(guildSnapshot.language) ? guildSnapshot.language : defaultLanguage;
    client.translate = require("../languages/" + client.config.language.code + ".json");
}

module.exports = {
    chatSystem,
    levelSystem,
    settingsData
}
