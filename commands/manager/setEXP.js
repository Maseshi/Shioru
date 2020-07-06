const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_ROLES"])) {
        let notification = message.guild.channels.cache.find(ch => ch.name === "│การแจ้งเตือน🔔");

        let arg = args[0];
        let amount = args.slice(1).join(" ");
        if (arg === undefined) {
            message.reply("❓ กรุณาระบุสมาชิกที่ต้องการจะเปลี่ยนแปลง EXP ด้วยคะ!")
                .then(function (msg) {
                    msg.delete({
                        timeout: 10000
                    });
                });
        } else {
            let user = client.users.cache.find(user => (user.username === arg) || (user.id === arg));
            if (user === undefined) {
                message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า..?");
            } else {
                if (amount === "") {
                    message.reply("❓ ต้องการจะตั้งค่าให้เท่าไหร่ดีคะ")
                        .then(function (msg) {
                            msg.delete({
                                timeout: 10000
                            });
                        });
                } else {
                    let database = firebase.database();
                    let avatar = user.avatarURL();
                    let username = user.username;
                    let id = user.id;
                    database.ref("Discord/Users/" + id + "/Leveling/").update({
                        EXP: amount
                    }).then(function () {
                        database.ref("Discord/Users/" + id + "/Leveling/").once("value")
                        .then(function (snapshot) {
                            let exp = (snapshot.val().EXP);
                            let level = (snapshot.val().Level);

                            let embed = {
                                "description": username + " ขณะนี้ Exp และ Level ทั้งหมดมีอยู่:",
                                "color": 4886754,
                                "thumbnail": {
                                    "url": avatar
                                },
                                "footer": {
                                    "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                                    "text": "EXP ของคุณถูกตั้งค่าโดยทีมงาน"
                                },
                                "fields": [
                                    {
                                        "name": "EXP",
                                        "value": "```" + exp + "```"
                                    },
                                    {
                                        "name": "Level",
                                        "value": "```" + level + "```"
                                    }
                                ]
                            };
                            notification.send({ embed })
                            .then(function () {
                                message.channel.send("✅ ตั้งค่าเสร็จเรียบร้อยแล้วค่าา...");
                            });
                        }).catch(function (error) {
                            console.error(error);
                        });
                    }).catch(function (error) {
                        message.channel.send("❎ ไม่พบผู้ใช้ในฐานข้อมูลคะ");
                        console.error(error);
                    });
                }
            }
        }
    } else {
        message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ <:shioru_heavy:694159309877018685>");
    }
};

module.exports.help = {
    "name": "setEXP",
    "description": "Set EXP of member",
    "usage": "YsetEXP <id> <amount>",
    "category": "manager",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"]
};