const { MessageEmbed } = require("discord.js");
const { getDatabase, ref, child, get } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message) => {
    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), message.guild.id);
    get(child(childRef, "data/users")).then((snapshot) => {
        if (snapshot.exists()) {
            const map = [];
            const max = 10;
            
            snapshot.forEach((data) => {
                const member = message.guild.members.cache.find(members => (members.id === data.key));
                
                if (!member) return message.reply(client.translate.commands.levelingBoard.can_not_find_user);

                const memberUsername = member.user.username;
                const exp = data.val().leveling.exp;
                const level = data.val().leveling.level;

                const jsonMap = {
                    "data": {
                        "exp": exp,
                        "level": level
                    },
                    "name": memberUsername,
                    "value": client.translate.commands.levelingBoard.leveling_detail.replace("%s1", exp).replace("%s2", level)
                };
                map.push(jsonMap);
            });
            
            map.sort((a, b) => {
                return b.data.level - a.data.level || b.data.exp - a.data.exp;
            });

            const user = message.guild.members.cache.find(members => (members.user.username === map[0].name));
            const clientAvatar = client.user.avatarURL();
            const userAvatar = user.user.displayAvatarURL();

            for (let i = 0; i < map.length; i++) {
                if (!map[i]) return;
                delete map[i].data;

                map[i].name = (i + 1) + ". " + map[i].name;
            }
            
            if (map.length >= max) map.length = max;

            const embed = new MessageEmbed()
            .setColor("#E01055")
            .setTitle(client.translate.commands.levelingBoard.server_rank)
            .setAuthor({ "name": client.user.username, "iconURL": clientAvatar })
            .setThumbnail(userAvatar)
            .setDescription(client.translate.commands.levelingBoard.server_rank_description)
            .addFields(map)
            .setTimestamp()
            .setFooter({ "text": client.translate.commands.levelingBoard.server_rank_tips, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/electric-light-bulb_1f4a1.png" });
            
            return message.channel.send({ "embeds": [ embed ] });
        }
    }).catch((error) => {
        catchError(client, message, module.exports.help.name, error);
    });
};

module.exports.help = {
    "name": "levelingBoard",
    "description": "See the ranking of people with the most EXP and Level on the server.",
    "usage": "levelingBoard",
    "category": "leveling",
    "aliases": ["คะแนนเลเวล", "เลเวลผู้นำ", "levelingboard", "lBoard", "levelingB", "lb"],
    "clientPermissions": ["SEND_MESSAGES"]
};