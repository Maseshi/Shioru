const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    let arg = args.join(" ");
    let avatar = message.author.displayAvatarURL();
    let id = message.author.id;

    if (arg) {
        let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
        if (!member) return message.reply(client.translate.commands.leveling.can_not_find_user);

        avatar = member.user.avatarURL();
        id = member.user.id;
        
        getLevel(avatar, id);
    } else {
        getLevel(avatar, id);
    }

    function getLevel(avatar, id) {
        let ref = database().ref("Shioru/apps/discord/guilds").child(message.guild.id);

        ref.child("data/users").child(id).once("value").then(function (snapshot) {
            if (!snapshot.exists()) return message.reply(client.translate.commands.leveling.user_no_data);
            
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;

            message.channel.send({
                "embeds": [
                    {
                        "title": client.translate.commands.leveling.your_experience,
                        "color": 4886754,
                        "thumbnail": {
                            "url": avatar
                        },
                        "fields": [
                            {
                                "name": client.translate.commands.leveling.level,
                                "value": "```" + level + "```"
                            },
                            {
                                "name": client.translate.commands.leveling.experience,
                                "value": "```" + exp + "```"
                            }
                        ]
                    }
                ]
            });
        }).catch(function (error) {
            catchError(client, message, module.exports.help.name, error);
        });
    }
};

module.exports.help ={
    "name": "leveling",
    "description": "See your leveling amount",
    "usage": "leveling (member: id, username, username&tag)",
    "category": "leveling",
    "aliases": ["Leveling", "leveling", "เลเวล", "เวล"],
    "permissions": ["SEND_MESSAGES"]
};