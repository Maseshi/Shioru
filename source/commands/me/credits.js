module.exports.run = (client, message, args) => {
    const clientUsername = client.user.username;
    const clientAvatar = client.user.displayAvatarURL();
    const update = client.config.update;

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.credits.creator_credit,
                "description": client.translate.commands.credits.creator_credit_description,
                "color": 12390624,
                "timestamp": update,
                "footer": {
                    "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/lower-left-ballpoint-pen_1f58a.png",
                    "text": client.translate.commands.credits.update_on
                },
                "author": {
                    "name": clientUsername,
                    "iconURL": clientAvatar
                },
                "fields": [
                    {
                        "name": "1. 夏月 まりな (NATSUKI MARINA)",
                        "value": client.translate.commands.credits.natsuki_marina_credit
                    }
                ]
            }
        ]
    });
};

module.exports.help = {
    "name": "credits",
    "description": "Credit of other creators.",
    "usage": "credits",
    "category": "me",
    "aliases": ["เครดิต", "creator"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "credits",
            "th": "เครดิต"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Credit of other creators.",
            "th": "เครดิตของผู้สร้างรายอื่น"
        }
    },
    async execute(interaction) {
        const clientUsername = interaction.client.user.username;
        const clientAvatar = interaction.client.user.displayAvatarURL();
        const update = interaction.client.config.update;

        await interaction.editReply({
            "embeds": [
                {
                    "title": interaction.client.translate.commands.credits.creator_credit,
                    "description": interaction.client.translate.commands.credits.creator_credit_description,
                    "color": 12390624,
                    "timestamp": update,
                    "footer": {
                        "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/lower-left-ballpoint-pen_1f58a.png",
                        "text": interaction.client.translate.commands.credits.update_on
                    },
                    "author": {
                        "name": clientUsername,
                        "iconURL": clientAvatar
                    },
                    "fields": [
                        {
                            "name": "1. 夏月 まりな (NATSUKI MARINA)",
                            "value": interaction.client.translate.commands.credits.natsuki_marina_credit
                        }
                    ]
                }
            ]
        });
    }
};