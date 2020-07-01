const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let database = firebase.database();
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;
    database.ref("Discord/Users/" + id + "/Leveling/").once("value")
    .then(function (snapshot) {
        let exp = (snapshot.val().EXP);
        let level = (snapshot.val().Level);

        const embed = {
            "description": username + " ตอนนี้คุณมี:",
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
    });
};

module.exports.help ={
    "name": "leveling",
    "description": "See your leveling amount",
    "usage": "Cleveling",
    "category": "fun",
    "aliases": ["Leveling", "EXP", "exp", "level", "เลเวล", "อีเอ็กพี", "เวล"]
};