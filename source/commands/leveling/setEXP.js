const levelSystem = require("../../extras/levelSystem");

module.exports.run = async (client, message, args) => {
    const inputMember = args[0];
    const inputAmount = parseInt(args.slice(1).join(" "));

    if (!inputMember) return message.reply(client.translate.commands.setEXP.empty);
    if (!inputAmount) return message.reply(client.translate.commands.setEXP.amount_empty);
    
    const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
    
    if (!member) return message.reply(client.translate.commands.setEXP.can_not_find_user);

    const memberAvatar = member.user.avatarURL();
    const memberUsername = member.user.username;
    const memberID = member.user.id;

    const data = await levelSystem(client, message, "PUT", memberID, inputAmount);
    
    const exp = data.exp;
    const level = data.level;
    const notify = data.notify;
    const status = data.status;

    if (status === "error") return message.reply(client.translate.commands.setEXP.error);
    if (notify) {
        await notify.send({
            "embeds": [
                {
                    "description": client.translate.commands.setEXP.exp_was_changed.replace("%s", memberUsername),
                    "color": 4886754,
                    "thumbnail": {
                        "url": memberAvatar
                    },
                    "footer": {
                        "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                        "text": client.translate.commands.setEXP.set_by_staff
                    },
                    "fields": [
                        {
                            "name": client.translate.commands.setEXP.level,
                            "value": "```" + level + "```"
                        },
                        {
                            "name": client.translate.commands.setEXP.experience,
                            "value": "```" + exp + "```"
                        }
                    ]
                }
            ]
        });

        message.channel.send(client.translate.commands.setEXP.notification_complete);
    } else {
        message.channel.send(client.translate.commands.setEXP.success);
    }
};

module.exports.help = {
    "name": "setEXP",
    "description": "Set EXP of member",
    "usage": "setEXP <member<id, username, username&tag>> <amount>",
    "category": "leveling",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"],
    "userPermission": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};