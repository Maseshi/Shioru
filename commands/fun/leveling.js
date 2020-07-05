const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;
    let arg = args.join(" ");
    if (arg) {
        let user = client.users.cache.find(user => (user.username === arg) || (user.id === arg));
        if (user === undefined) {
            message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า..?");
        } else {
            avatar = user.avatarURL();
            username = user.username;
            id = user.id;
            getLeveling(avatar, username, id);
        }
    } else {
        getLeveling(avatar, username, id);
    }

    function getLeveling(avatar, username, id) {
        let database = firebase.database();
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
            message.channel.send({ embed });
        }).catch(function (error) {
            console.error(error);
            message.channel.send("❎ สมาชิกรายนี้ยังไม่มี Exp กับ Level เลยคะ");
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