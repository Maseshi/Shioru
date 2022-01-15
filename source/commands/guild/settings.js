const { MessageEmbed } = require("discord.js");
const { getDatabase, ref, child, get, set, update } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports.run = async (client, message, args) => {
    const inputOption = args[0];
    const inputConfig = args[1];
    const inputSet = args[2];
    
    let lang, prefix, notify, rank, avatar, info, uid;
    const mePrefix = client.config.prefix;
    const guildId = message.guild.id;

    const optionInfoEmbed = new MessageEmbed()
    .setColor("#E01055")
    .setTitle(client.translate.commands.settings.settings)
    .setDescription(client.translate.commands.settings.settings_description)
    .addField(client.translate.commands.settings.private, "```" + mePrefix + module.exports.help.name + " user```", true)
    .setFooter({ "text": client.translate.commands.settings.beta_function, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png" });

    const configInfoEmbed = new MessageEmbed()
    .setColor("#E01055")
    .setFooter({ "text": client.translate.commands.settings.beta_function, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png" });

    const setInfoEmbed = new MessageEmbed()
    .setColor("#E01055")
    .setFooter({ "text": client.translate.commands.settings.beta_function, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png" })
    .setTimestamp();

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), guildId);

    // Get guild settings
    await get(child(childRef, "config")).then((snapshot) => {
        if (snapshot.exists()) {
            lang = snapshot.val().language;
            prefix = snapshot.val().prefix;
            notify = snapshot.val().notification;
            // rank = snapshot.val().rank;
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
                // "rank": {
                //     "active": false,
                //     "channel": 0,
                //     "role": []
                // }
            }).then(() => {
                return module.exports.run(client, message, args);
            });
        }
    }).catch((error) => {
		catchError(client, message, module.exports.help.name, error);
	});

    // Get user settings
    await get(child(child(childRef, "data/users"), message.author.id)).then((snapshot) => {
        if (snapshot.exists()) {
            avatar = snapshot.val().access.avatar;
            info = snapshot.val().access.info;
            uid = snapshot.val().access.uid;
        } else {
            set(child(child(childRef, "data/users"), message.author.id), {
                "access": {
                    "avatar": false,
                    "info": false,
                    "uid": false
                },
                "leveling": {
                    "level": 0,
                    "exp": 0
                }
            }).then(() => {
                return module.exports.run(client, message, args);
            });
        }
    }).catch((error) => {
		catchError(client, message, module.exports.help.name, error);
	});

    if (!inputOption) {
        if (message.member.permissions.has(["MANAGE_GUILD"])) {
            optionInfoEmbed
            .addField(client.translate.commands.settings.server, "```" + mePrefix + module.exports.help.name + " guild```", true);
        }

        return message.reply({
            "embeds": [ optionInfoEmbed ],
            "allowedMentions": {
                "repliedUser": false
            }
        });
    }

    if (!["user", "guild"].includes(inputOption)) {
        if (message.member.permissions.has(["MANAGE_GUILD"])) {
            return message.reply(client.translate.commands.settings.available_options_of_user);
        }
        
        return message.reply(client.translate.commands.settings.available_options_of_stuff);
    }

    switch (inputOption) {
        case "user":
            configInfoEmbed
            .setTitle(client.translate.commands.settings.settings_private);
            setInfoEmbed
            .setTitle(client.translate.commands.settings.settings_private)
            
            if (!inputConfig) {
                configInfoEmbed
                .setDescription(client.translate.commands.settings.settings_private_description)
                .addFields(
                    { "name": client.translate.commands.settings.allow, "value": "```" + mePrefix + module.exports.help.name + " user access" + "```", "inline": true },
                );
                
                return message.reply({
                    "embeds": [ configInfoEmbed ],
                    "allowedMentions": {
                        "repliedUser": false
                    }
                });
            }

            switch (inputConfig) {
                case "access":
                    if (!inputSet) {
                        if (!avatar) avatar = client.translate.commands.settings.not_allowed;
                        if (!info) info = client.translate.commands.settings.not_allowed;
                        if (!uid) uid = client.translate.commands.settings.not_allowed;

                        setInfoEmbed
                        .setDescription(client.translate.commands.settings.access_description)
                        .addFields(
                            { "name": client.translate.commands.settings.current, "value": "```avatar: " + avatar + "\ninfo: " + info + "\nuid: " + uid + "```", "inline": false },
                            { "name": client.translate.commands.settings.how_to_change, "value": "```" + mePrefix + module.exports.help.name + " user access <option> <boolean>" + "```", "inline": false },
                            { "name": client.translate.commands.settings.advice, "value": client.translate.commands.settings.access_advice_detail, "inline": false }
                        );

                        return message.reply({
                            "embeds": [ setInfoEmbed ],
                            "allowedMentions": {
                                "repliedUser": false
                            }
                        });
                    }
                    if (!["avatar", "info", "uid"].includes(inputSet)) return message.reply(client.translate.commands.settings.do_not_have_access_name);
                    if (!args[3]) return message.reply(client.translate.commands.settings.access_guide);
                    if (!["false", "true"].includes(args[3])) return message.reply(client.translate.commands.settings.access_true_or_false);

                    switch (args[3]) {
                        case "true":
                            if (eval(inputSet) === true) return message.reply(client.translate.commands.settings.access_current_true);
                            
                            set(child(child(child(child(childRef, "data/users"), message.author.id), access), inputSet), true).then(() => {
                                message.channel.send(client.translate.commands.settings.access_true_success);
                            }).catch((error) => {
                                catchError(client, message, module.exports.help.name, error);
                            });
                        break;
                        case "false":
                            if (eval(inputSet) === false) return message.reply(client.translate.commands.settings.access_current_false);
                            
                            set(child(child(child(child(childRef, "data/users"), message.author.id), access), inputSet), false).then(() => {
                                message.channel.send(client.translate.commands.settings.access_false_success);
                            }).catch((error) => {
                                catchError(client, message, module.exports.help.name, error);
                            });
                        break;
                    }
                break;
            }
        break;
        case "guild":
            configInfoEmbed
            .setTitle(client.translate.commands.settings.settings_server);
            setInfoEmbed
            .setTitle(client.translate.commands.settings.settings_server);
            
            if (!message.member.permissions.has(["MANAGE_GUILD"])) {
                return message.reply(client.translate.commands.settings.not_owner);
            }
            
            if (!inputConfig) {
                configInfoEmbed
                .setDescription(client.translate.commands.settings.settings_server_description)
                .addFields(
                    { "name": client.translate.commands.settings.prefix, "value": "```" + mePrefix + module.exports.help.name + " guild prefix" + "```", "inline": true },
                    { "name": client.translate.commands.settings.languages, "value": "```" + mePrefix + module.exports.help.name + " guild lang" + "```", "inline": true },
                    { "name": client.translate.commands.settings.notification, "value": "```" + mePrefix + module.exports.help.name + " guild notify" + "```", "inline": true }
                );

                return message.reply({ "embeds": [ configInfoEmbed ], "allowedMentions": { "repliedUser": false } });
            }

            switch (inputConfig) {
                case "prefix":
                    if (!inputSet) {
                        setInfoEmbed
                        .setDescription(client.translate.commands.settings.prefix_description)
                        .addFields(
                            { "name": client.translate.commands.settings.current, "value": "```" + prefix + "```", "inline": false },
                            { "name": client.translate.commands.settings.how_to_change, "value": "```" + mePrefix + module.exports.help.name + " guild prefix <prefix>```", "inline": false },
                            { "name": client.translate.commands.settings.advice, "value": client.translate.commands.settings.prefix_advice_detail, "inline": false }
                        );

                        return message.reply({ "embeds": [ setInfoEmbed ], "allowedMentions": { "repliedUser": false } });
                    }
                    if (inputSet === mePrefix) return message.reply(client.translate.commands.settings.current_prefix);
                    if (inputSet.length >= 6) return message.reply(client.translate.commands.settings.prefix_no_more_than_six_characters);
                    
                    update(child(childRef, "config"), {
                        "prefix": inputSet
                    }).then(() => {
                        message.channel.send(client.translate.commands.settings.new_prefix);
                    }).catch((error) => {
                        catchError(client, message, module.exports.help.name, error);
                    });
                break;
                case "lang":
                    let code = client.config.lang.code;
                    const supportList = Object.keys(client.config.lang.support);

                    if (!inputSet) {
                        setInfoEmbed
                        .setDescription(client.translate.commands.settings.lang_description)
                        .addFields(
                            { "name": client.translate.commands.settings.current, "value": "```" + lang + "```", "inline": false },
                            { "name": client.translate.commands.settings.how_to_change, "value": "```" + mePrefix + module.exports.help.name + " guild lang <language>```", "inline": false },
                            { "name": client.translate.commands.settings.advice, "value": client.translate.commands.settings.lang_advice_detail, "inline": false },
                            { "name": client.translate.commands.settings.available, "value": "```" + supportList + "```", "inline": false }
                        );

                        return message.reply({ "embeds": [ setInfoEmbed ], "allowedMentions": { "repliedUser": false } });
                    }
                    if (inputSet.toLowerCase() === code) return message.reply(client.translate.commands.settings.current_lang);
                    if (!supportList.includes(inputSet.toLowerCase())) return message.reply(client.translate.commands.settings.not_support_or_do_not_have);

                    code = inputSet.toLowerCase();

                    update(child(childRef, "config"), {
                        "language": code
                    }).then(() => {
                        message.channel.send(client.translate.commands.settings.lang_success.replace("%s", code));
                    }).catch((error) => {
                        catchError(client, message, module.exports.help.name, error);
                    });
                break;
                case "notify":
                    if (!inputSet) {
                        let channelName, channelId, availableChannel = "", embedField = "";
                        
                        for (channelName of Object.keys(notify)) {
                            channelId = await get(child(child(childRef, "config/notification"), channelName)).then(snapshot => snapshot.val());
                            channelId = channelId ? "<#" + channelId + ">" : client.translate.commands.settings.not_set_up;

                            embedField += (channelName + ": " + channelId + "\n");
                            availableChannel += channelName + ", ";
                        }

                        setInfoEmbed
                        .setDescription(client.translate.commands.settings.notify_description)
                        .addFields(
                            { "name": client.translate.commands.settings.current, "value": embedField, "inline": false },
                            { "name": client.translate.commands.settings.how_to_change, "value": "```" + mePrefix + module.exports.help.name + " guild notify <notification> <boolean> <channel>```", "inline": false },
                            { "name": client.translate.commands.settings.advice, "value": client.translate.commands.settings.notify_advice, "inline": false },
                            { "name": client.translate.commands.settings.available, "value": "```" + availableChannel + "```", "inline": false }
                        );

                        message.reply({ "embeds": [ setInfoEmbed ], "allowedMentions": { "repliedUser": false } });
                    } else {
                        let channelName, channelId, channelType = [];
                        
                        for (channelName of Object.keys(notify)) {
                            channelId = await get(child(child(childRef, "config/notification"), channelName)).then(snapshot => snapshot.val());
                            channelType.push(channelName);
                        }

                        if (!channelType.includes(inputSet)) return message.reply(client.translate.commands.settings.no_channel_type);
                        if (!args[3]) return message.reply(client.translate.commands.settings.notify_guide_true_or_false);
                        if (!["true", "false"].includes(args[3])) return message.reply(client.translate.commands.settings.notify_true_or_false);
                        
                        switch (args[3]) {
                            case "true":
                                if (channelId) return message.reply(client.translate.commands.settings.notify_current_true);
                                if (args[4]) {
                                    const channel = message.guild.channels.cache.find(channels => (channels.name === args[4]) || (channels.id === args[4]));
                                    
                                    if (!channel) return message.reply(client.translate.commands.settings.do_not_have_channel_in_server);
                                    
                                    set(child(child(childRef, "config/notification"), inputSet), args[4]).then(() => {
                                        message.channel.send(client.translate.commands.settings.notify_true_success.replace("%s", args[4]));
                                    }).catch((error) => {
                                        catchError(client, message, module.exports.help.name, error);
                                    });
                                } else {
                                    const dfChannel = message.guild.channels.cache.filter(channels => channels.type === "text").find(x => x.position === 0);
                                    
                                    set(child(child(childRef, "config/notification"), inputSet), dfChannel.id).then(() => {
                                        message.channel.send(client.translate.commands.settings.notify_default_true_success.replace("%s", dfChannel.id));
                                    }).catch((error) => {
                                        catchError(client, message, module.exports.help.name, error);
                                    });
                                }
                            break;
                            case "false":
                                if (!channelId) return message.channel.send(client.translate.commands.settings.notify_current_false);
                                
                                set(child(child(childRef, "config/notification"), inputSet), 0).then(() => {
                                    message.channel.send(client.translate.commands.settings.notify_false_success);
                                }).catch((error) => {
                                    catchError(client, message, module.exports.help.name, error);
                                });
                            break;
                        }
                    }
                break;
                // case "rank":
                //     if (rank) {
                //         let rankActive = rank.active ? "เปิด" : "ปิด";
                //         let rankChannel = rank.channel ? "<#" + rankChannel + ">" : "ยังไม่ได้ตั้ง";
                //         let rankRole = rank.role || "ยังไม่ได้ตั้ง";
                //         let roleName, roleColor, rolePermission;
    
                //         if (Array.isArray(rankRole)) {
                //             rankRole.forEach(function (role) {
                //                 roleName = role.name;
                //                 roleColor = role.color;
                //                 rolePermission = role.permission;
                //             });
                //         }
    
                //         if (!set) {
                //             let embedField = "**เปิดใช้งาน:** %s1\n**ช่อง:** %s2\n**บทบาท:** %s3".replace("%s1", rankActive).replace("%s2", rankChannel).replace("%s3", rankRole);
    
                //             setInfoEmbed.setDescription("rank - แยกแยะสมาชิกตามบทบาทการอนุญาตของเซิร์ฟเวอร์ตามที่กำหนด")
                //             .addFields(
                //                 { "name": client.translate.commands.settings.current, "value": embedField, "inline": false },
                //                 { "name": client.translate.commands.settings.how_to_change, "value": "```" + mePrefix + module.exports.help.name + " guild rank <options: add, remove || boolean: true, false> <role: name || channel: name, id> (color) (permission)```", "inline": false },
                //                 { "name": client.translate.commands.settings.advice, "value": "```ควรตั้งค่าคำสั่งนี้ หากต้องการแยกสมาชิกหรือหากเป็นเซิร์ฟเวอร์ชุ่มชน```", "inline": false }
                //             );
                //             message.reply({ "embeds": [ setInfoEmbed ], "allowedMentions": { "repliedUser": false } });
                //         } else {
                //             let options = [ "add", "remove" ];
    
                //             if (options.includes(set)) {
                //                 switch (set) {
                //                     case options[0]:
                                        
                //                     break;
                //                     case options[1]:

                //                     break;
                //                 }
                //             } else if (!options.includes(set) && set === "true" || !options.includes(set) && set === "false") {

                //             } else {
                //                 return message.reply("❎ ตอนนี้ยังไม่มีตัวเลือกนี้อะ ที่มีอยู่ในตอนนี้ คือ %s".replace("%s", options.join()));
                //             }
                //         }
                //     } else {
                //         ref.child("config/rank").set({
                //             "active": false,
                //             "channel": 0,
                //             "role": []
                //         }).then(function () {
                //             module.exports.run(client, message, args);
                //         }).catch(function (error) {
                //             catchError(client, message, module.exports.help.name, error);
                //         });
                //     }
                // break;
            }
        break;
    }
};

module.exports.help = {
    "name": "settings",
    "description": "Set up Shioru only on this server.",
    "usage": "settings <type> <options>",
    "category": "guild",
    "aliases": ["config", "cf", "set", "ตั้งค่า", "การตั้งค่า"],
    "clientPermissions": ["SEND_MESSAGES"]
};