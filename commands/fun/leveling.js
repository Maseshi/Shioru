const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;
    let arg = args.join(" ");
    if (arg) {
        let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
        if (!user) {
            message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า?");
        } else {
            avatar = user.avatarURL();
            username = user.username;
            id = user.id;
            getLeveling(avatar, username, id);
        }
    } else {
        getLeveling(avatar, username, id);
    }

    function getLeveling(Savatar, Susername, Sid) {
        let database = firebase.database();
        database.ref("Discord/Users/" + Sid + "/Leveling/").once("value")
        .then(function (snapshot) {
            if (snapshot.exists()) {
                let exp = snapshot.val().EXP;
                let level = snapshot.val().Level;

                let embed = {
                    "description": Susername + " ได้สะสมระดับประสบการณ์ทั้งหมด มี:",
                    "color": 4886754,
                    "thumbnail": {
                        "url": Savatar
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
                };
                message.channel.send({
                    embed
                });
            } else {
                message.channel.send("💨 อืมม...สมาชิกรายนี้ยังไม่มีระดับประสบการณ์เลยคะ");
            }
        }).catch(function (error) {
            console.log(error);
            message.channel.send("⚠️ เกิดข้อผิดพลาดซ่ะแล้วคะ!! แจ้งมาว่า: " + error);
        });
    }
};

module.exports.help ={
    "name": "leveling",
    "description": "See your leveling amount",
    "usage": "Yleveling",
    "category": "fun",
    "aliases": ["Leveling", "EXP", "exp", "level", "เลเวล", "อีเอ็กพี", "เวล"]
};