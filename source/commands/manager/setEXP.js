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
    "description": "Set the members' experience.",
    "usage": "setEXP <member: id, username, tag> <amount>",
    "category": "manager",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"],
    "userPermissions": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name.toLowerCase(),
        "name_localizations": {
            "en-US": "setEXP",
            "th": "ตั้งค่าค่าประสบการณ์"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Set the members' experience.",
            "th": "ตั้งค่าค่าประสบการณ์ของสมาชิก"
        },
        "options": [
            {
                "type": 6,
                "name": "member",
                "name_localizations": {
                    "th": "สมาชิก"
                },
                "description": "The name of the member who wants to set the experience value.",
                "description_localizations": {
                    "th": "ชื่อของสมาชิกที่ต้องการกำหนดค่าประสบการณ์"
                },
                "required": true
            },
            {
                "type": 10,
                "name": "amount",
                "name_localizations": {
                    "th": "จำนวน"
                },
                "description": "The amount of experience that you want to set.",
                "description_localizations": {
                    "th": "จำนวนค่าประสบการณ์ที่คุณต้องการตั้งค่า"
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

        if (!member) return await interaction.editReply(interaction.client.translate.commands.setEXP.can_not_find_user);

        const memberAvatar = member.user.avatarURL();
        const memberUsername = member.user.username;
        const memberID = member.user.id;

        const data = await levelSystem(interaction.client, interaction, "PUT", memberID, inputAmount);

        const exp = data.exp;
        const level = data.level;
        const notify = data.notify;
        const status = data.status;

        if (status === "error") return await interaction.editReply(interaction.client.translate.commands.setEXP.error);
        if (notify) {
            await notify.send({
                "embeds": [
                    {
                        "description": interaction.client.translate.commands.setEXP.exp_was_changed.replace("%s", memberUsername),
                        "color": 4886754,
                        "thumbnail": {
                            "url": memberAvatar
                        },
                        "footer": {
                            "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                            "text": interaction.client.translate.commands.setEXP.set_by_staff
                        },
                        "fields": [
                            {
                                "name": interaction.client.translate.commands.setEXP.level,
                                "value": "```" + level + "```"
                            },
                            {
                                "name": interaction.client.translate.commands.setEXP.experience,
                                "value": "```" + exp + "```"
                            }
                        ]
                    }
                ]
            });

            await interaction.editReply(interaction.client.translate.commands.setEXP.notification_complete);
        } else {
            await interaction.editReply(interaction.client.translate.commands.setEXP.success);
        }
    }
};