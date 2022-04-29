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
    "usage": "setLevel <member; id, username, tag> <amount>",
    "category": "manager",
    "aliases": ["sLevel", "setlevel", "ตั้งค่าเลเวล"],
    "userPermissions": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name.toLowerCase(),
        "name_localizations": {
            "en-US": "setLevel",
            "th": "ตั้งค่าเลเวล"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Set the members' level.",
            "th": "ตั้งค่าค่าประสบการณ์ของสมาชิก"
        },
        "options": [
            {
                "type": 6,
                "name": "member",
                "name_localizations": {
                    "th": "สมาชิก"
                },
                "description": "The name of the member who wants to set the level value.",
                "description_localizations": {
                    "th": "ชื่อของสมาชิกที่ต้องการกำหนดค่าเลเวล"
                },
                "required": true
            },
            {
                "type": 10,
                "name": "amount",
                "name_localizations": {
                    "th": "จำนวน"
                },
                "description": "The amount of level that you want to set.",
                "description_localizations": {
                    "th": "จำนวนเลเวลที่คุณต้องการตั้งค่า"
                },
                "required": true,
                "min_value": 0
            }
        ]
    },
    async execute(interaction) {
        const inputMember = interaction.options.get("member").value;
        const inputAmount = interaction.options.get("amount").value;

        const member = interaction.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));

        if (!member) return await interaction.editReply(interaction.client.translate.commands.setLevel.can_not_find_user);

        const memberAvatar = member.user.avatarURL();
        const memberUsername = member.user.username;
        const memberID = member.user.id;

        const data = levelSystem(interaction.client, interaction, "PUT", memberID, inputAmount);

        const exp = data.exp;
        const level = data.level;
        const notify = data.notify;
        const status = data.status;

        if (status === "error") return await interaction.editReply(interaction.client.translate.commands.setLevel.error);
        if (notify) {
            await notify.send({
                "embeds": [
                    {
                        "description": interaction.client.translate.commands.setLevel.level_was_changed.replace("%s", memberUsername),
                        "color": 4886754,
                        "thumbnail": {
                            "url": memberAvatar
                        },
                        "footer": {
                            "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                            "text": interaction.client.translate.commands.setLevel.set_by_staff
                        },
                        "fields": [
                            {
                                "name": interaction.client.translate.commands.setLevel.level,
                                "value": "```" + exp + "```"
                            },
                            {
                                "name": interaction.client.translate.commands.setLevel.experience,
                                "value": "```" + level + "```"
                            }
                        ]
                    }
                ]
            });

            await interaction.editReply(interaction.client.translate.commands.setLevel.notification_complete);
        } else {
            await interaction.editReply(interaction.client.translate.commands.setLevel.success);
        }
    }
}