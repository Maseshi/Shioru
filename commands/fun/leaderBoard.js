const discord = require("discord.js");
const firebase = require("firebase");

module.exports.run = async function (client, message) {
    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("data/users").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let map = [], max = 10;
            snapshot.forEach(function(data) {
                let member = message.guild.members.cache.find(members => (members.id === data.key));
                if (!member) return;

                let username = member.user.username;
                let exp = data.val().leveling.exp;
                let level = data.val().leveling.level;

                let jsonMap = {
                    "data": {
                        "exp": exp,
                        "level": level
                    },
                    "name": username,
                    "value": "ค่าประสบการณ์: " + exp + ", ระดับชั้น: " + level
                };
                map.push(jsonMap);
            });
            
            map.sort(function(a, b) {
                return b.data.level - a.data.level || b.data.exp - a.data.exp;
            });

            let member = message.guild.members.cache.find(members => (members.user.username === map[0].name));
            let avatar = member.user.displayAvatarURL();

            for (let i = 0; i < map.length; i++) {
                if (!map[i]) return;
                delete map[i].data;

                map[i].name = (i + 1) + ". " + map[i].name;
            }
            
            if (map.length >= max) map.length = max;

            const embed = new discord.MessageEmbed()
            .setColor("#E01055")
            .setTitle("อันดับเลเวลของเซิร์ฟเวอร์นี้")
            .setAuthor(client.user.username, client.user.avatarURL())
            .setThumbnail(avatar)
            .setDescription("1 ใน 10 อันดับ สมาชิกภายในเซิร์ฟเวอร์นี้ ที่เก็บสะสมเลเวลของตัวเองได้เยอะที่สุด ตามลำดับ ดังนี้")
            .addFields(map)
            .setTimestamp()
            .setFooter("เคล็ดลับ: การพูดคุยกับสมาชิกคนอื่นๆ จะทำให้ได้รับเลเวลมากขึ้น", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/electric-light-bulb_1f4a1.png");
            return message.channel.send(embed);
        }
    });
};

module.exports.help = {
    "name": "leaderBoard",
    "description": "See the ranking of people with the most EXP and Level on the server.",
    "usage": "leaderBoard",
    "category": "fun",
    "aliases": ["คะแนน", "คณะผู้นำ", "leaderboard", "lBoard", "leaderB", "lb"],
    "permissions": ["SEND_MESSAGES"]
};