const discord = require("discord.js");
const firebase = require("firebase");
const fs = require("fs");

module.exports.run = async function(client, message, args) {
    let arg = args[0], set = args[1], valueSet = args[2];
    let mePrefix = client.config.prefix;
    let guildId = message.guild.id;

    let CFInfo = new discord.MessageEmbed()
    .setColor("#E01055")
    .setTitle("⚙ การตั้งค่า (เซิร์ฟเวอร์)")
    .setFooter("ฟังก์ชันนี้กำลังอยู่ในช่วงทดสอบ", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png")
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
                        "title": "⚙ การตั้งค่า (เซิร์ฟเวอร์)",
                        "description": "คำนำหน้า, ภาษา, ช่องแจ้งเตือน ฯลฯ ซึ่งการตั้งค่าเหล่านี้จะมีผลเฉพาะเซิร์ฟเวอร์นี้เท่านั้น คุณสามารถปรับแต่งเองได้ตามต้องการเลยย...",
                        "color": 14684245,
                        "footer": {
                            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/nazar-amulet_1f9ff.png",
                            "text": "ฟังก์ชันนี้กำลังอยู่ในช่วงทดสอบ"
                        },
                        "fields": [
                            {
                                "name": "❔ คำนำหน้า",
                                "value": "```" + mePrefix + module.exports.help.name + " prefix" + "```",
                                "inline": true
                            },
                            {
                                "name": "🌐 ภาษา",
                                "value": "```" + mePrefix + module.exports.help.name + " lang" + "```",
                                "inline": true
                            },
                            {
                                "name": "🔔 การแจ้งเตือน",
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
                            CFInfo.setDescription("prefix - เปลี่ยนวิธีในการเรียกฉันด้วยคำนำหน้าใหม่ ที่ไฉไลกว่าเดิม ヾ(•ω•`)o")
                            .addField("🏷 ปัจจุบัน", "```" + prefix + "```", false)
                            .addField("✏ วิธีเปลี่ยน", "```" + mePrefix + module.exports.help.name + " prefix <prefix>```", false)
                            .addField("💡 คำแนะนำ", "```การใช้คำนำหน้านั้น ไม่ควรมีตัวอักษรมากกว่าหรือเท่ากับ 6 ตัวอักษร```", false);
                            message.channel.send(CFInfo);
                        } else {
                            if (set === client.config.prefix) {
                                message.channel.send("❌ ปัจจุบันเซิร์ฟเวอร์นี้ใช้คำนำหน้านี้อยู่แล้วคะ");
                            } else {
                                if (set.length >= 6) {
                                    message.reply("❎ การตั้งคำนำหน้าเพื่อเรียกฉันนั้นไม่ควรมีมากกว่าหรือเท่ากับ 6 ตัวอักษรนะค่าา...");
                                } else {
                                    ref.update({
                                        "prefix": set
                                    }).then(function () {
                                        message.channel.send("🔧 ตั้งค่าเป็นคำนำหน้าใหม่เป็น " + set + " ละคะ");
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
                            CFInfo.setDescription("lang - ฉันสามารถคุยด้วยกันได้หลายภาษา ถ้าอ่านไม่ออก..ให้ลองเปลี่ยนดูนะ")
                            .addField("🏷 ปัจจุบัน", "```" + lang + "```", false)
                            .addField("✏ วิธีเปลี่ยน", "```" + mePrefix + module.exports.help.name + " lang <language>```", false)
                            .addField("💡 คำแนะนำ", "```ภาษาบางภาษาอาจจะยังไม่ได้รับการแปลและอาจจะแปลได้ไม่สมบูรณ์```", false)
                            .addField("✅ พร้อมใช้งาน", "```" + langName + "```", false);
                            message.channel.send(CFInfo);
                        } else {
                            if (set === client.lang.details.id) {
                                message.channel.send("❌ ปัจจุบันเซิร์ฟเวอร์นี้เป็นภาษานี้อยู่แล้วคะ");
                            } else {
                                try {
                                    const langName = require("../../languages/" + set + ".json");
                                    if (langName.details.id) {
                                        ref.update({
                                            "language": langName.details.id
                                        }).then(function () {
                                            message.channel.send("🔧 ตอนนี้ฉันตั้งค่าเป็นภาษา " + langName.details.name + " แล้วคะ");
                                        });
                                    }
                                } catch (err) {
                                    message.channel.send("❎ เอิ่มม..ณ ขณะนี้ยังไม่มีภาษานี้น่ะคะ ต้องขออภัยด้วยคะ...");
                                }
                            }
                        }
                    }
                    if (arg === "notify") {
                        if (!set) {
                            CFInfo.setDescription("notify - การแจ้งเตือนการเปลี่ยนแปลงและเหตุการ์ณต่างๆ ได้รวมอยู่ในนี้ คุณสามารถเปลี่ยนแปลงได้ตลอดเวลา")
                            .addField("🏷 ปัจจุบัน", "```" + notifyEnable + " - (" + notifyId + ")" + "```", false)
                            .addField("✏ วิธีเปลี่ยน", "```" + mePrefix + module.exports.help.name + " notify <boolean> <channel id>```", false)
                            .addField("💡 คำแนะนำ", "```ช่องทางการแจ้งเตือนไม่ควรอยู่ในช่องการพูดคุยทั่วไป```", false);
                            message.channel.send(CFInfo);
                        } else {
                            if (!set) {
                                message.reply("❓ ต้องการที่จะเปิดหรือปิดการแจ้งเตือนดีคะ หากต้องการเปิดให้พิมพ์ \"true\" ถ้ายังไม่ต้องการให้พิมพ์ \"false\"");
                            } else {
                                if (set === "true" || set === "false") {
                                    if (set === "true") {
                                        if (set === notifyEnable.toString()) {
                                            message.channel.send("❌ ปัจจุบันเซิร์ฟเวอร์นี้ได้เปิดการแจ้งเตือนไว้อยู่แล้วคะ");
                                        } else {
                                            ref.child("channels/notification").update({
                                                "enable": true
                                            }).then(function () {
                                                if (valueSet) {
                                                    let channel = message.guild.channels.cache.find(channels => (channels.name === valueSet) || (channels.id === valueSet));
                                                    if (!channel) {
                                                        message.channel.send("❎ อืมม..ดูเหมือนจะไม่มีช่องนี้ในเซิร์ฟเวอร์นะ");
                                                    } else {
                                                        ref.child("channels/notification").update({
                                                            "id": valueSet
                                                        }).then(function () {
                                                            message.channel.send("🔧 เปิดการแจ้งเตือนไปยังช่อง <#" + valueSet + "> แล้วคะ");
                                                        });
                                                    }
                                                } else {
                                                    let dfChannel = message.guild.channels.cache.filter(c => c.type === 'text').find(x => x.position == 0);
                                                    if (notifyId === 0) {
                                                        message.channel.send("🔧 เปิดการแจ้งเตือนที่ช่อง <#" + dfChannel + "> เรียบร้อยแล้วคะ");
                                                    } else {
                                                        message.channel.send("🔧 เปิดการแจ้งเตือนที่ช่อง <#" + valueSet + "> เรียบร้อยแล้วคะ");
                                                    }
                                                }
                                            });
                                        }
                                    }
                                    if (set === "false") {
                                        if (set === notifyEnable.toString()) {
                                            message.channel.send("❌ ปัจจุบันเซิร์ฟเวอร์นี้ได้เปิดการแจ้งเตือนไว้อยู่แล้วคะ");
                                        } else {
                                            ref.child("channels/notification").update({
                                                "enable": false
                                            }).then(function () {
                                                if (valueSet) {
                                                    let channel = message.guild.channels.cache.find(channels => (channels.name === valueSet) || (channels.id === valueSet));
                                                    if (!channel) {
                                                        message.channel.send("❎ อืมม..ดูเหมือนจะไม่มีช่องนี้ในเซิร์ฟเวอร์นะ");
                                                    } else {
                                                        ref.child("channels/notification").update({
                                                            "id": valueSet
                                                        }).then(function () {
                                                            message.channel.send("🔧 ปิดการแจ้งเตือนไปยังช่อง <#" + valueSet + "> แล้วคะ");
                                                        });
                                                    }
                                                } else {
                                                    let dfChannel = message.guild.channels.cache.filter(c => c.type === 'text').find(x => x.position == 0);
                                                    if (notifyId === 0) {
                                                        message.channel.send("🔧 ปิดการแจ้งเตือนที่ช่อง <#" + dfChannel + "> เรียบร้อยแล้วคะ");
                                                    } else {
                                                        message.channel.send("🔧 ปิดการแจ้งเตือนที่ช่อง <#" + valueSet + "> เรียบร้อยแล้วคะ");
                                                    }
                                                }
                                            });
                                        }
                                    }
                                } else {
                                    message.channel.send("❎ เอิ่มม..ตรงส่วนนี้มีแต่ true กับ false นะคะ");
                                }
                            }
                        }
                    }
                } else {
                    message.channel.send("🔒 คำสั่งนี้ทำได้เฉพาะระดับผู้ดูแลเท่านั้นคะ");
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