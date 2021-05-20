const discord = require("discord.js");
const firebase = require("firebase");
const fs = require("fs");

module.exports.run = async function(client, message, args) {
    let option = args[0], config = args[1], set = args[2];
    let lang, prefix, notify, avatar, info, uid, level, exp;
    let mePrefix = client.config.prefix;
    let guildId = message.guild.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(guildId);

    // Get guild settings
    await ref.child("config").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            lang = snapshot.val().language;
            prefix = snapshot.val().prefix;
            notify = snapshot.val().notification;
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
                return module.exports.run(client, message, args);
            });
        }
    });

    // Get user settings
    await ref.child("data/users").child(message.author.id).once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            avatar = snapshot.val().access.avatar;
            info = snapshot.val().access.info;
            uid = snapshot.val().access.uid;

            level = snapshot.val().leveling.level;
            exp = snapshot.val().leveling.exp;
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
            });
        }
    });

    let optionInfoEmbed = new discord.MessageEmbed()
    .setColor("#E01055")
    .setTitle("⚙ การตั้งค่า")
    .setDescription("คุณสามารถจัดการการตั้งค่าเหล่านี้ได้ โดยคุณสามารถแก้ไขการตั้งค่าทั้งหมดได้ดังนี้")
    .addField("🙍‍ ส่วนตัว", "```" + mePrefix + module.exports.help.name + " user```",true)
    .setFooter("ฟังก์ชันนี้กำลังอยู่ในช่วงทดสอบ", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png");

    let configInfoEmbed = new discord.MessageEmbed()
    .setColor("#E01055")
    .setFooter(client.lang.command_manager_settings_arg_empty_embed_footer_text, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png");

    let setInfoEmbed = new discord.MessageEmbed()
    .setColor("#E01055")
    .setFooter(client.lang.command_manager_settings_embed_CFInfo_footer_text, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png")
    .setTimestamp();

    if (!option) {
        if (message.member.hasPermission(["MANAGE_GUILD"])) {
            optionInfoEmbed.addField("🗄 เซิร์ฟเวอร์", "```" + mePrefix + module.exports.help.name + " guild```",true);
        }

        return message.reply(optionInfoEmbed);
    }

    switch (option) {
        case "user":
            configInfoEmbed.setTitle("⚙ การตั้งค่า (ส่วนตัว)");
            setInfoEmbed.setTitle("⚙ การตั้งค่า (ส่วนตัว)")
            if (!config) {
                configInfoEmbed.setDescription("หากคุณต้องการที่จะจัดการกับตัวเลือกใดๆ คุณสามารถตั้งค่าเกี่ยวกับคุณได้โดยมีคำสั่งทั้งหมดดังนี้")
                .addFields(
                    { "name": "🔑 การอนุญาต", "value": "```" + mePrefix + module.exports.help.name + " user access" + "```", "inline": true },
                );
                return message.reply(configInfoEmbed);
            }

            switch (config) {
                case "access":
                    if (!set) {
                        if (!avatar) avatar = "ไม่อนุญาต";
                        if (!info) info = "ไม่อนุญาต";
                        if (!uid) uid = "ไม่อนุญาต";

                        setInfoEmbed.setDescription("access - อนุญาตให้ข้อมูลบางอย่างเกี่ยวกับคุณ สามารถเปิดเผยได้")
                        .addFields(
                            { "name": "🏷 ปัจจุบัน", "value": "```avatar: " + avatar + "\ninfo: " + info + "\nuid: " + uid + "```", "inline": false },
                            { "name": "✏ วิธีเปลี่ยน", "value": "```" + mePrefix + module.exports.help.name + " user access <option> <boolean>" + "```", "inline": false },
                            { "name": "💡 คำแนะนำ", "value": "```การอนุญาตในแต่ละส่วนจะมีผลกับคำสั่งบางรายการเช่นกัน```", "inline": false }
                        );
                        return message.reply(setInfoEmbed);
                    }
                    if (!["avatar", "info", "uid"].includes(set)) return message.reply("❎ ดูเหมือนจะยังไม่มีการอนุญาตดังกล่าวนะคะ ลองตรวจสอบใหม่ดูอีกครั้งนะคะ");
                    if (!args[3]) return message.reply("❎ คุณสามารถตั้งค่าส่วนนี้ได้โดยหากคุณต้องการเปิดเผยข้อมูลดังกล่าวให้พิมพ์ต่อจากนี้คือ \"true\" และหากคุณไม่ต้องการให้เปิดเผยข้อมูลดังกล่าวให้พิมพ์ต่อจากนี้คือ \"false\"");
                    if (!["false", "true"].includes(args[3])) return message.reply("❎ เอิ่มม...ตรงส่วนนี้มีแต่ \"true\" กับ \"false\" นะคะ ต้องการที่จะทำอะไรเหรอ?");

                    switch (args[3]) {
                        case "true":
                            if (eval(set) === true) return message.reply("❎ ปัจจุบันอนุญาตให้เปิดเผยข้อมูลนี้อยู่แล้ว");
                            ref.child("data/users").child(message.author.id).child("access").child(set).set(true).then(function() {
                                message.channel.send("🔧 เปิดเผยข้อมูลดังกล่าวเรียบร้อยแล้วคะ");
                            });
                        break;
                        case "false":
                            if (eval(set) === false) return message.reply("❎ ปัจจุบันไม่อนุญาตให้เปิดเผยข้อมูลนี้อยู่แล้ว");
                            ref.child("data/users").child(message.author.id).child("access").child(set).set(false).then(function() {
                                message.channel.send("🔧 ยกเลิกเปิดเผยข้อมูลดังกล่าวเรียบร้อยแล้วคะ");
                            });
                        break;
                    }
                break;
            }
        break;
        case "guild":
            configInfoEmbed.setTitle(client.lang.command_manager_settings_arg_empty_embed_title);
            setInfoEmbed.setTitle(client.lang.command_manager_settings_embed_CFInfo_title)
            if (!message.member.hasPermission(["MANAGE_GUILD"])) return message.reply(client.lang.command_manager_settings_dont_have_permission);
            
            if (!config) {
                configInfoEmbed.setDescription(client.lang.command_manager_settings_arg_empty_embed_description)
                .addFields(
                    { "name": client.lang.command_manager_settings_arg_empty_embed_field_0, "value": "```" + mePrefix + module.exports.help.name + " guild prefix" + "```", "inline": true },
                    { "name": client.lang.command_manager_settings_arg_empty_embed_field_1, "value": "```" + mePrefix + module.exports.help.name + " guild lang" + "```", "inline": true },
                    { "name": client.lang.command_manager_settings_arg_empty_embed_field_2, "value": "```" + mePrefix + module.exports.help.name + " guild notify" + "```", "inline": true }
                );
                return message.reply(configInfoEmbed);
            }

            switch (config) {
                case "prefix":
                    if (!set) {
                        setInfoEmbed.setDescription(client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_description)
                        .addFields(
                            { "name": client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_0, "value": "```" + prefix + "```", "inline": false },
                            { "name": client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_1, "value": "```" + mePrefix + module.exports.help.name + " guild prefix <prefix>```", "inline": false },
                            { "name": client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_2, "value": client.lang.command_manager_settings_prefix_arg_empty_embed_CFInfo_field_2_value, "inline": false }
                        );
                        return message.reply(setInfoEmbed);
                    }

                    if (set === client.config.prefix) return message.reply(client.lang.command_manager_settings_prefix_has_already_prefix);
                    if (set.length >= 6) return message.reply(client.lang.command_manager_settings_prefix_less);
                    
                    ref.child("config").update({
                        "prefix": set
                    }).then(function () {
                        message.channel.send(client.lang.command_manager_settings_prefix_then_success.replace("%newPrefix", set));
                    });
                break;
                case "lang":
                    if (!set) {
                        let langName = "";
                        let langFiles = fs.readdirSync("languages").filter(files => files.endsWith(".json"));
                        
                        for (let file of langFiles) {
                            let langList = require("../../languages/" + file);
                            langName += langList.details.name + ", ";

                            if ((lang + ".json") === file) lang = langList.details.name;
                        }

                        setInfoEmbed.setDescription(client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_description)
                        .addFields(
                            { "name": client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_0, "value": "```" + lang + "```", "ineline": false },
                            { "name": client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_1, "value": "```" + mePrefix + module.exports.help.name + " guild lang <language>```", "ineline": false },
                            { "name": client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_2, "value": client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_2_value, "ineline": false },
                            { "name": client.lang.command_manager_settings_lang_arg_empty_embed_CFInfo_field_3, "value": "```" + langName + "```", "ineline": false }
                        );
                        return message.reply(setInfoEmbed);
                    }

                    if (set === client.lang.details.id) return message.reply(client.lang.command_manager_settings_lang_has_already_lang);

                    let langName;
                    
                    switch (set) {
                        case "ไทย":
                            set = "th_TH";
                        break;
                        case "English":
                            set = "en_US";
                        break;
                    }

                    try {
                        langName = require("../../languages/" + set + ".json");
                    } catch (err) {
                        return message.reply(client.lang.command_manager_settings_lang_catch_error);
                    }
                    
                    ref.child("config").update({
                        "language": langName.details.id
                    }).then(function () {
                        message.channel.send(client.lang.command_manager_settings_lang_then_success.replace("%newLangName", langName.details.name));
                    });
                break;
                case "notify":
                    if (!set) {
                        let channelName, channelId, availableChannel = "", embedField = "";
                        for (let i = 0; i < Object.keys(notify).length; i++) {
                            channelName = Object.keys(notify)[i];
                            channelId = await ref.child("config/notification").child(channelName).once("value").then(snapshot => snapshot.val());

                            if (!channelId) channelId = "ไม่ได้ตั้งค่าไว้";
                            channelId = "<#" + channelId + ">";

                            embedField += (channelName + ": " + channelId + "\n");
                            availableChannel += channelName + ", ";
                        }

                        setInfoEmbed.setDescription(client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_description)
                        .addFields(
                            { "name": client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_0, "value": embedField, "inline": false },
                            { "name": client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_1, "value": "```" + mePrefix + module.exports.help.name + " guild notify <notification> <boolean> <channel>```", "inline": false },
                            { "name": client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_2, "value": client.lang.command_manager_settings_notify_arg_empty_embed_CFInfo_field_2_value, "inline": false },
                            { "name": "✅ พร้อมใช้งาน", "value": "```" + availableChannel + "```", "inline": false }
                        );
                        message.reply(setInfoEmbed);
                    } else {
                        let channelName, channelId, channelType = [];
                        for (let i = 0; i < Object.keys(notify).length; i++) {
                            channelName = Object.keys(notify)[i];
                            channelId = await ref.child("config/notification").child(channelName).once("value").then(snapshot => snapshot.val());

                            channelType.push(channelName);
                        }

                        if (!channelType.includes(set)) return message.reply("❎ ดูเหมือนจะยังไม่มีประเภทของช่องดังกล่าวนะคะหรือลองตรวจสอบใหม่อีกครั้งดูคะ");
                        if (!args[3]) return message.reply(client.lang.command_manager_settings_notify_arg_empty);
                        if (!["true", "false"].includes(args[3])) return message.reply(client.lang.command_manager_settings_notify_arg_wrong);
                            
                        let thisId;
                        for (let i = 0; i < Object.keys(notify).length; i++) {
                            channelName = Object.keys(notify)[i];
                            if (channelName === set) {
                                thisId = await ref.child("config/notification").child(channelName).once("value").then(snapshot => snapshot.val());
                            }
                        }

                        switch (args[3]) {
                            case "true":
                                if (thisId) return message.reply(client.lang.command_manager_settings_notify_true_has_already);
                                if (args[4]) {
                                    let channel = message.guild.channels.cache.find(channels => (channels.name === args[4]) || (channels.id === args[4]));
                                    if (!channel) return message.reply(client.lang.command_manager_settings_notify_true_not_found_channel);
                                    ref.child("config/notification").child(set).set(args[4]).then(function () {
                                        message.channel.send(client.lang.command_manager_settings_notify_true_then_success.replace("%newChannel", args[4]));
                                    });
                                } else {
                                    let dfChannel = message.guild.channels.cache.filter(channels => channels.type === "text").find(x => x.position === 0);
                                    ref.child("config/notification").child(set).set(dfChannel.id);
                                    message.channel.send(client.lang.command_manager_settings_notify_true_if_id_equal_zero.replace("%dfChannel", dfChannel.id));
                                }
                            break;
                            case "false":
                                if (!thisId) return message.channel.send(client.lang.command_manager_settings_notify_false_has_already);
                                ref.child("config/notification").child(set).set(0).then(function () {
                                    message.channel.send(client.lang.command_manager_settings_notify_false_then_success);
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
    "category": "manager",
    "aliases": ["config", "cf", "set", "ตั้งค่า", "การตั้งค่า"],
    "permissions": ["SEND_MESSAGES"]
};