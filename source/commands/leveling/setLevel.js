const levelSystem = require("../../extras/levelSystem");

module.exports.run = async (client, message, args) => {
    const inputMember = args[0];
    const inputAmount = parseInt(args.slice(1).join(" "));

    if (!inputMember) return message.reply(client.translate.commands.setLevel.empty);
    if (!inputAmount) return message.reply(client.translate.commands.setLevel.amount_empty);
    
    const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
    
    if (!member) return message.reply(client.translate.commands.setLevel.can_not_find_user);

    const memberAvatar = member.user.avatarURL();
    const memberUsername = member.user.username;
    const memberID = member.user.id;

    const data = levelSystem(client, message, "PUT", memberID, inputAmount);

    const exp = data.exp;
    const level = data.level;
    const notify = data.notify;
    const status = data.status;

    if (status === "error") return message.reply(client.translate.commands.setLevel.error);
    if (notify) {
        await notify.send({
            "embeds": [
                {
                    "description": client.translate.commands.setLevel.level_was_changed.replace("%s", memberUsername),
                    "color": 4886754,
                    "thumbnail": {
                        "url": memberAvatar
                    },
                    "footer": {
                        "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                        "text": client.translate.commands.setLevel.set_by_staff
                    },
                    "fields": [
                        {
                            "name": client.translate.commands.setLevel.level,
                            "value": "```" + exp + "```"
                        },
                        {
                            "name": client.translate.commands.setLevel.experience,
                            "value": "```" + level + "```"
                        }
                    ]
                }
            ]
        });

        message.channel.send(client.translate.commands.setLevel.notification_complete);
    } else {
        message.channel.send(client.translate.commands.setLevel.success);
    }
};

module.exports.help = {
    "name": "setLevel",
    "description": "Set Level of Members",
    "usage": "setLevel <member<id, username, username&tag>> <amount>",
    "category": "leveling",
    "aliases": ["sLevel", "setlevel", "ตั้งค่าเลเวล"],
    "userPermission": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};