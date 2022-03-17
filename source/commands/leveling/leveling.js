const levelSystem = require("../../extras/levelSystem");

module.exports.run = async (client, message, args) => {
    const inputMember = args.join(" ");
    let authorAvatar = message.author.displayAvatarURL();
    let authorID = message.author.id;

    if (inputMember) {
        const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
        
        if (!member) return message.reply(client.translate.commands.leveling.can_not_find_user);

        authorAvatar = member.user.avatarURL();
        authorID = member.user.id;
    }

    const data = await levelSystem(client, message, "GET", authorID);

    if (!data) return message.reply(client.translate.commands.leveling.user_no_data);

    const exp = data.exp;
    const level = data.level;
    const nextEXP = data.nextEXP;

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.leveling.your_experience,
                "color": 4886754,
                "thumbnail": {
                    "url": authorAvatar
                },
                "fields": [
                    {
                        "name": client.translate.commands.leveling.level,
                        "value": "```" + level + "```"
                    },
                    {
                        "name": client.translate.commands.leveling.experience,
                        "value": "```" + exp + "/" + nextEXP + "```"
                    }
                ]
            }
        ]
    });
};

module.exports.help ={
    "name": "leveling",
    "description": "See your leveling amount",
    "usage": "leveling (member: id, username, username&tag)",
    "category": "leveling",
    "aliases": ["Leveling", "leveling", "เลเวล", "เวล"],
    "clientPermissions": ["SEND_MESSAGES"]
};