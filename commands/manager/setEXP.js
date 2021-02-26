const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_ROLES"])) {
        let arg = args[0];
        let amount = parseInt(args.slice(1).join(" "));
        if (!arg) {
            message.reply("❓ กรุณาระบุสมาชิกที่ต้องการจะเปลี่ยนแปลง EXP ด้วยคะ!");
        } else {
            let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
            if (!user) {
                message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า?");
            } else {
                if (isNaN(amount)) {
                    message.reply("❓ ต้องการจะตั้งค่าให้สมาชิกนี้เท่าไหร่ดีคะ ต้องเป็นจำนวนนับนะ");
                } else {
                    let database = firebase.database();
                    let avatar = user.avatarURL();
                    let username = user.username;
                    let id = user.id;
                    database.ref("Shioru/Discord/Users/" + id + "/Leveling/").update({
                        "EXP": amount
                    }).then(function () {
                        database.ref("Shioru/Discord/Users/" + id + "/Leveling/").once("value")
                            .then(function (snapshot) {
                                if (snapshot.exists()) {
                                    let exp = snapshot.val().EXP;
                                    let level = snapshot.val().Level;
                                    let notifyEnable = snapshot.val().channels.notification.enable;
                                    let notifyId = snapshot.val().channels.notification.id;

                                    if (notifyEnable === true) {
                                        let notification = message.guild.channels.cache.find(ch => ch.id === notifyId);
                                        notification.send({
                                            "embed": {
                                                "description": username + " ได้สะสมระดับประสบการณ์ทั้งหมด มี:",
                                                "color": 4886754,
                                                "thumbnail": {
                                                    "url": avatar
                                                },
                                                "footer": {
                                                    "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                                                    "text": "EXP ของคุณถูกตั้งค่าโดยทีม"
                                                },
                                                "fields": [
                                                    {
                                                        "name": "ชั้น (Level)",
                                                        "value": "```" + level + "```"
                                                    },
                                                    {
                                                        "name": "ประสบการณ์ (Exp)",
                                                        "value": "```" + exp + "```"
                                                    }
                                                ]
                                            }
                                        }).then(function () {
                                            message.channel.send("✅ ตั้งค่าเสร็จเรียบร้อยแล้วค่าา...");
                                        });
                                    }
                                } else {
                                    message.channel.send("❎ ไม่พบสมชิกรายนี้ในฐานข้อมูลเลยคะ");
                                }
                            }).catch(function (error) {
                                console.log(error);
                                message.channel.send("⚠️ เกิดข้อผิดพลาดในขณะที่กำลังตรวจสอบทรัพยากร: " + error);
                            });
                    }).catch(function (error) {
                        console.log(error);
                        message.channel.send("⚠️ เกิดข้อผิดพลาดในขณะที่กำลังอัพเดททรัพยากร: " + error);
                    });
                }
            }
        }
    } else {
        message.channel.send("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ");
    }
};

module.exports.help = {
    "name": "setEXP",
    "description": "Set EXP of member",
    "usage": "setEXP <name/id> <amount>",
    "category": "manager",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"]
};