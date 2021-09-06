const { MessageEmbed } = require("discord.js");
const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message) {
    let ref = database().ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("data/users").once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let map = [], max = 10;
            snapshot.forEach(function(data) {
                let member = message.guild.members.cache.find(members => (members.id === data.key));
                if (!member) return message.reply(client.translate.commands.levelingBoard.can_not_find_user);

                let username = member.user.username;
                let exp = data.val().leveling.exp;
                let level = data.val().leveling.level;

                let jsonMap = {
                    "data": {
                        "exp": exp,
                        "level": level
                    },
                    "name": username,
                    "value": client.translate.commands.levelingBoard.leveling_detail.replace("%s1", exp).replace("%s2", "level")
                };
                map.push(jsonMap);
            });
            
            map.sort(function(a, b) {
                return b.data.level - a.data.level || b.data.exp - a.data.exp;
            });

            let user = message.guild.members.cache.find(members => (members.user.username === map[0].name));
            let avatar = user.user.displayAvatarURL();

            for (let i = 0; i < map.length; i++) {
                if (!map[i]) return;
                delete map[i].data;

                map[i].name = (i + 1) + ". " + map[i].name;
            }
            
            if (map.length >= max) map.length = max;

            const embed = new MessageEmbed()
            .setColor("#E01055")
            .setTitle(client.translate.commands.levelingBoard.server_rank)
            .setAuthor(client.user.username, client.user.avatarURL())
            .setThumbnail(avatar)
            .setDescription(client.translate.commands.levelingBoard.server_rank_description)
            .addFields(map)
            .setTimestamp()
            .setFooter(client.translate.commands.levelingBoard.server_rank_tips, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/electric-light-bulb_1f4a1.png");
            return message.channel.send({ "embeds": [ embed ] });
        }
    }).catch(function(error) {
        catchError(client, message, module.exports.help.name, error);
    });
};

module.exports.help = {
    "name": "levelingBoard",
    "description": "See the ranking of people with the most EXP and Level on the server.",
    "usage": "levelingBoard",
    "category": "leveling",
    "aliases": ["คะแนนเลเวล", "เลเวลผู้นำ", "levelingboard", "lBoard", "levelingB", "lb"],
    "permissions": ["SEND_MESSAGES"]
};