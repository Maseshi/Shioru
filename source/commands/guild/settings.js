const { MessageEmbed } = require("discord.js");
const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports.run = async function(client, message, args) {
    let option = args[0], config = args[1], set = args[2];
    let lang, prefix, notify, avatar, info, uid;
    let mePrefix = client.config.prefix;
    let guildId = message.guild.id;

    let ref = database().ref("Shioru/apps/discord/guilds").child(guildId);

    // Get guild settings
    await ref.child("config").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            lang = snapshot.val().language;
            prefix = snapshot.val().prefix;
            notify = snapshot.val().notification;
        } else {
            ref.child("config").set({
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
            }).then(function () {
                return module.exports.run(client, message, args);
            }).catch(function (error) {
                catchError(client, message, module.exports.help.name, error);
            });
        }
    }).catch(function (error) {
		catchError(client, message, module.exports.help.name, error);
	});

    // Get user settings
    await ref.child("data/users").child(message.author.id).once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            avatar = snapshot.val().access.avatar;
            info = snapshot.val().access.info;
            uid = snapshot.val().access.uid;
        } else {
            ref.child("data/users").child(message.author.id).set({
                "access": {
                    "avatar": false,
                    "info": false,
                    "uid": false
                },
                "leveling": {
                    "level": 0,
                    "exp": 0
                }
            }).then(function () {
                return module.exports.run(client, message, args);
            }).catch(function (error) {
                catchError(client, message, module.exports.help.name, error);
            });
        }
    }).catch(function (error) {
		catchError(client, message, module.exports.help.name, error);
	});

    let optionInfoEmbed = new MessageEmbed()
    .setColor("#E01055")
    .setTitle(client.translate.commands.settings.settings)
    .setDescription(client.translate.commands.settings.settings_description)
    .addField(client.translate.commands.settings.private, "```" + mePrefix + module.exports.help.name + " user```",true)
    .setFooter(client.translate.commands.settings.beta_function, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png");

    let configInfoEmbed = new MessageEmbed()
    .setColor("#E01055")
    .setFooter(client.translate.commands.settings.beta_function, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png");

    let setInfoEmbed = new MessageEmbed()
    .setColor("#E01055")
    .setFooter(client.translate.commands.settings.beta_function, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png")
    .setTimestamp();

    if (!option) {
        if (message.member.permissions.has(["MANAGE_GUILD"])) {
            optionInfoEmbed.addField(client.translate.commands.settings.server, "```" + mePrefix + module.exports.help.name + " guild```",true);
        }
        return message.reply({
            "embeds": [ optionInfoEmbed ],
            "allowedMentions": {
                "repliedUser": false
            }
        });
    }

    switch (option) {
        case "user":
            configInfoEmbed.setTitle(client.translate.commands.settings.settings_private);
            setInfoEmbed.setTitle(client.translate.commands.settings.settings_private)
            if (!config) {
                configInfoEmbed.setDescription(client.translate.commands.settings.settings_private_description)
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

            switch (config) {
                case "access":
                    if (!set) {
                        if (!avatar) avatar = client.translate.commands.settings.not_allowed;
                        if (!info) info = client.translate.commands.settings.not_allowed;
                        if (!uid) uid = client.translate.commands.settings.not_allowed;

                        setInfoEmbed.setDescription(client.translate.commands.settings.access_description)
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
                    if (!["avatar", "info", "uid"].includes(set)) return message.reply(client.translate.commands.settings.do_not_have_access_name);
                    if (!args[3]) return message.reply(client.translate.commands.settings.access_guide);
                    if (!["false", "true"].includes(args[3])) return message.reply(client.translate.commands.settings.access_true_or_false);

                    switch (args[3]) {
                        case "true":
                            if (eval(set) === true) return message.reply(client.translate.commands.settings.access_current_true);
                            ref.child("data/users").child(message.author.id).child("access").child(set).set(true).then(function() {
                                message.channel.send(client.translate.commands.settings.access_true_success);
                            }).catch(function (error) {
                                catchError(client, message, module.exports.help.name, error);
                            });
                        break;
                        case "false":
                            if (eval(set) === false) return message.reply(client.translate.commands.settings.access_current_false);
                            ref.child("data/users").child(message.author.id).child("access").child(set).set(false).then(function() {
                                message.channel.send(client.translate.commands.settings.access_false_success);
                            }).catch(function (error) {
                                catchError(client, message, module.exports.help.name, error);
                            });
                        break;
                    }
                break;
            }
        break;
        case "guild":
            configInfoEmbed.setTitle(client.translate.commands.settings.settings_server);
            setInfoEmbed.setTitle(client.translate.commands.settings.settings_server);
            if (!message.member.permissions.has(["MANAGE_GUILD"])) return message.reply(client.translate.commands.settings.not_owner);
            
            if (!config) {
                configInfoEmbed.setDescription(client.translate.commands.settings.settings_server_description)
                .addFields(
                    { "name": client.translate.commands.settings.prefix, "value": "```" + mePrefix + module.exports.help.name + " guild prefix" + "```", "inline": true },
                    { "name": client.translate.commands.settings.languages, "value": "```" + mePrefix + module.exports.help.name + " guild lang" + "```", "inline": true },
                    { "name": client.translate.commands.settings.notification, "value": "```" + mePrefix + module.exports.help.name + " guild notify" + "```", "inline": true }
                );
                return message.reply({ "embeds": [ configInfoEmbed ], "allowedMentions": { "repliedUser": false } });
            }

            switch (config) {
                case "prefix":
                    if (!set) {
                        setInfoEmbed.setDescription(client.translate.commands.settings.prefix_description)
                        .addFields(
                            { "name": client.translate.commands.settings.current, "value": "```" + prefix + "```", "inline": false },
                            { "name": client.translate.commands.settings.how_to_change, "value": "```" + mePrefix + module.exports.help.name + " guild prefix <prefix>```", "inline": false },
                            { "name": client.translate.commands.settings.advice, "value": client.translate.commands.settings.prefix_advice_detail, "inline": false }
                        );
                        return message.reply({ "embeds": [ setInfoEmbed ], "allowedMentions": { "repliedUser": false } });
                    }

                    if (set === mePrefix) return message.reply(client.translate.commands.settings.current_prefix);
                    if (set.length >= 6) return message.reply(client.translate.commands.settings.prefix_no_more_than_six_characters);
                    
                    ref.child("config").update({
                        "prefix": set
                    }).then(function () {
                        message.channel.send(client.translate.commands.settings.new_prefix);
                    }).catch(function (error) {
                        catchError(client, message, module.exports.help.name, error);
                    });
                break;
                case "lang":
                    let code = client.config.lang.code;
                    let supportList = Object.keys(client.config.lang.support);

                    if (!set) {
                        setInfoEmbed.setDescription(client.translate.commands.settings.lang_description)
                        .addFields(
                            { "name": client.translate.commands.settings.current, "value": "```" + lang + "```", "ineline": false },
                            { "name": client.translate.commands.settings.how_to_change, "value": "```" + mePrefix + module.exports.help.name + " guild lang <language>```", "ineline": false },
                            { "name": client.translate.commands.settings.advice, "value": client.translate.commands.settings.lang_advice_detail, "ineline": false },
                            { "name": client.translate.commands.settings.available, "value": "```" + supportList + "```", "ineline": false }
                        );
                        return message.reply({ "embeds": [ setInfoEmbed ], "allowedMentions": { "repliedUser": false } });
                    }

                    if (set.toLowerCase() === code) return message.reply(client.translate.commands.settings.current_lang);
                    if (!supportList.includes(set.toLowerCase())) return message.reply(client.translate.commands.settings.not_support_or_do_not_have);

                    code = set.toLowerCase();

                    ref.child("config").update({
                        "language": code
                    }).then(function () {
                        message.channel.send(client.translate.commands.settings.lang_success.replace("%s", code));
                    }).catch(function (error) {
                        catchError(client, message, module.exports.help.name, error);
                    });
                break;
                case "notify":
                    if (!set) {
                        let channelName, channelId, availableChannel = "", embedField = "";
                        for (channelName of Object.keys(notify)) {
                            channelId = await ref.child("config/notification").child(channelName).once("value").then(snapshot => snapshot.val());
                            channelId = channelId ? "<#" + channelId + ">" : client.translate.commands.settings.not_set_up;

                            embedField += (channelName + ": " + channelId + "\n");
                            availableChannel += channelName + ", ";
                        }

                        setInfoEmbed.setDescription(client.translate.commands.settings.notify_description)
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
                            channelId = await ref.child("config/notification").child(channelName).once("value").then(snapshot => snapshot.val());
                            channelType.push(channelName);
                        }

                        if (!channelType.includes(set)) return message.reply(client.translate.commands.settings.no_channel_type);
                        if (!args[3]) return message.reply(client.translate.commands.settings.notify_guide_true_or_false);
                        if (!["true", "false"].includes(args[3])) return message.reply(client.translate.commands.settings.notify_true_or_false);
                        
                        switch (args[3]) {
                            case "true":
                                if (channelId) return message.reply(client.translate.commands.settings.notify_current_true);
                                if (args[4]) {
                                    let channel = message.guild.channels.cache.find(channels => (channels.name === args[4]) || (channels.id === args[4]));
                                    if (!channel) return message.reply(client.translate.commands.settings.do_not_have_channel_in_server);
                                    ref.child("config/notification").child(set).set(args[4]).then(function () {
                                        message.channel.send(client.translate.commands.settings.notify_true_success.replace("%s", args[4]));
                                    }).catch(function (error) {
                                        catchError(client, message, module.exports.help.name, error);
                                    });
                                } else {
                                    let dfChannel = message.guild.channels.cache.filter(channels => channels.type === "text").find(x => x.position === 0);
                                    ref.child("config/notification").child(set).set(dfChannel.id).catch(function (error) {
                                        catchError(client, message, module.exports.help.name, error);
                                    });
                                    message.channel.send(client.translate.commands.settings.notify_default_true_success.replace("%s", dfChannel.id));
                                }
                            break;
                            case "false":
                                if (!channelId) return message.channel.send(client.translate.commands.settings.notify_current_false);
                                ref.child("config/notification").child(set).set(0).then(function () {
                                    message.channel.send(client.translate.commands.settings.notify_false_success);
                                }).catch(function (error) {
                                    catchError(client, message, module.exports.help.name, error);
                                });
                            break;
                        }
                    }
                break;
            }
        break;
    }
};

module.exports.help = {
    "name": "settings",
    "description": "Set up Shioru only on this server.",
    "usage": "settings <option>",
    "category": "guild",
    "aliases": ["config", "cf", "set", "ตั้งค่า", "การตั้งค่า"],
    "permissions": ["SEND_MESSAGES"]
};