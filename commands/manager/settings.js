const discord = require("discord.js");
const firebase = require("firebase");
const fs = require("fs");

module.exports.run = async function(client, message, args) {
    let arg = args[0], set = args[1], valueSet = args[2];
    let mePrefix = client.config.prefix;
    let guildId = message.guild.id;

    let CFInfo = new discord.MessageEmbed()
    .setColor("#E01055")
    .setTitle(client.lang.command_manager_settings_embed_CFInfo_title)
    .setFooter(client.lang.command_manager_settings_embed_CFInfo_footer_text, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png")
    .setTimestamp();

    let database = firebase.database();
    let ref = database.ref("Shioru/Discord/Guilds/").child(guildId);

    ref.once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let lang = snapshot.val().language;
            let prefix = snapshot.val().prefix;
            let notifyEnable = snapshot.val().channels.notification.enable;
            let notifyId = snapshot.val().channels.notification.id;

            if (!arg) {
                message.channel.send({
                    "embed": {
                        "title": client.lang.command_manager_settings_arg_empty_embed_title,
                        "description": client.lang.command_manager_settings_arg_empty_embed_description,
                        "color": 14684245,
                        "footer": {
                            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png",
                            "text": client.lang.command_manager_settings_arg_empty_embed_footer_text
                        },
                        "fields": [
                            {
                                "name": client.lang.command_manager_settings_arg_empty_embed_field_0,
                                "value": "```" + mePrefix + module.exports.help.name + " prefix" + "```",
                                "inline": true
                            },
                            {
                                "name": client.lang.command_manager_settings_arg_empty_embed_field_1,
                                "value": "```" + mePrefix + module.exports.help.name + " lang" + "```",
                                "inline": true
                            },
                            {
                                "name": client.lang.command_manager_settings_arg_empty_embed_field_2,
                                "value": "```" + mePrefix + module.exports.help.name + " notify" + "```",
                                "inline": true
                            }
                        ]
                    }
                });
            } else {
                if (message.member.hasPermission(["ADMINISTRATOR"])) {
                    if (arg === "prefix") {
                        if (!set) {
                            CFInfo.setDescription(client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_description)
                            .addField(client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_0, "```" + prefix + "```", false)
                            .addField(client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_1, "```" + mePrefix + module.exports.help.name + " prefix <prefix>```", false)
                            .addField(client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_2, client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_2_value, false);
                            message.channel.send(CFInfo);
                        } else {
                            if (set === client.config.prefix) {
                                message.channel.send(client.lang.command_manager_settings_prefix_has_already_prefix);
                            } else {
                                if (set.length >= 6) {
                                    message.reply(client.lang.command_manager_settings_prefix_less);
                                } else {
                                    ref.update({
                                        "prefix": set
                                    }).then(function () {
                                        message.channel.send(client.lang.command_manager_settings_prefix_then_success.replace("%newPrefix", set));
                                    });
                                }
                            }
                        }
                    }
                    if (arg === "lang") {
                        if (!set) {
                            let langName = "",
                            langFiles = fs.readdirSync("./languages").filter(files => files.endsWith(".json"));
                            for (let file of langFiles) {
                                let langLists = require("../../languages/" + file);
                                langName += langLists.details.name + ", ";
                            }
                            CFInfo.setDescription(client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_description)
                            .addField(client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_0, "```" + lang + "```", false)
                            .addField(client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_1, "```" + mePrefix + module.exports.help.name + " lang <language>```", false)
                            .addField(client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_2, client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_2_value, false)
                            .addField(client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_3, "```" + langName + "```", false);
                            message.channel.send(CFInfo);
                        } else {
                            if (set === client.lang.details.id) {
                                message.channel.send(client.lang.command_manager_settings_lang_has_already_lang);
                            } else {
                                try {
                                    const langName = require("../../languages/" + set + ".json");
                                    if (langName.details.id) {
                                        ref.update({
                                            "language": langName.details.id
                                        }).then(function () {
                                            message.channel.send(client.lang.command_manager_settings_lang_then_success.replace("%newLangName", langName.details.name));
                                        });
                                    }
                                } catch (err) {
                                    message.channel.send(client.lang.command_manager_settings_lang_catch_error);
                                }
                            }
                        }
                    }
                    if (arg === "notify") {
                        if (!set) {
                            CFInfo.setDescription(client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_description)
                            .addField(client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_0, "```" + notifyEnable + " - (" + notifyId + ")" + "```", false)
                            .addField(client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_1, "```" + mePrefix + module.exports.help.name + " notify <boolean> <channel id>```", false)
                            .addField(client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_2, client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_2_value, false);
                            message.channel.send(CFInfo);
                        } else {
                            if (!set) {
                                message.reply(client.lang.command_manager_settings_notify_arg_empty);
                            } else {
                                if (set === "true" || set === "false") {
                                    if (set === "true") {
                                        if (set === notifyEnable.toString()) {
                                            message.channel.send(client.lang.command_manager_settings_notify_true_has_already);
                                        } else {
                                            ref.child("channels/notification").update({
                                                "enable": true
                                            }).then(function () {
                                                if (valueSet) {
                                                    let channel = message.guild.channels.cache.find(channels => (channels.name === valueSet) || (channels.id === valueSet));
                                                    if (!channel) {
                                                        message.channel.send(client.lang.command_manager_settings_notify_true_not_found_channel);
                                                    } else {
                                                        ref.child("channels/notification").update({
                                                            "id": valueSet
                                                        }).then(function () {
                                                            message.channel.send(client.lang.command_manager_settings_notify_true_then_success.replace("%newChannel", valueSet));
                                                        });
                                                    }
                                                } else {
                                                    let dfChannel = message.guild.channels.cache.filter(c => c.type === 'text').find(x => x.position == 0);
                                                    if (notifyId === 0) {
                                                        message.channel.send(client.lang.command_manager_settings_notify_true_if_id_equal_zero.replace("%dfChannel", dfChannel));
                                                    } else {
                                                        message.channel.send(client.lang.command_manager_settings_notify_true_else_id_equal_zero.replace("%newChannel", valueSet));
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (set === "false") {
                                        if (set === notifyEnable.toString()) {
                                            message.channel.send(client.lang.command_manager_settings_notify_false_has_already);
                                        } else {
                                            ref.child("channels/notification").update({
                                                "enable": false
                                            }).then(function () {
                                                if (valueSet) {
                                                    let channel = message.guild.channels.cache.find(channels => (channels.name === valueSet) || (channels.id === valueSet));
                                                    if (!channel) {
                                                        message.channel.send(client.lang.command_manager_settings_notify_false_not_found_channel);
                                                    } else {
                                                        ref.child("channels/notification").update({
                                                            "id": valueSet
                                                        }).then(function () {
                                                            message.channel.send(client.lang.command_manager_settings_notify_false_then_success.replace("%newChannel", valueSet));
                                                        });
                                                    }
                                                } else {
                                                    let dfChannel = message.guild.channels.cache.filter(c => c.type === 'text').find(x => x.position == 0);
                                                    if (notifyId === 0) {
                                                        message.channel.send(client.lang.command_manager_settings_notify_false_if_id_equal_zero.replace("%dfChannel", dfChannel));
                                                    } else {
                                                        message.channel.send(client.lang.command_manager_settings_notify_false_else_id_equal_zero.replace("%newChannel", valueSet));
                                                    }
                                                }
                                            });
                                        }
                                    }
                                } else {
                                    message.channel.send(client.lang.command_manager_settings_notify_arg_wrong);
                                }
                            }
                        }
                    }
                } else {
                    message.channel.send(client.lang.command_manager_settings_dont_have_permission);
                }
            }
        } else {
            ref.set({
                "prefix": "S",
                "language": "th_TH",
                "channels": {
                    "notification": {
                        "enable": false,
                        "id": 0
                    }
                }
            }).then(function () {
                module.exports(client, message, args);
            });
        }
    });
};

module.exports.help = {
    "name": "settings",
    "description": "Set up Shioru only on this server.",
    "usage": "settings <option>",
    "category": "manager",
    "aliases": ["config", "cf", "set", "ตั้งค่า", "การตั้งค่า"]
};