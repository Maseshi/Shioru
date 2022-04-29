module.exports.run = async (client, message, args) => {
    const prefix = client.config.prefix;

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.settings.title,
                "description": client.translate.commands.settings.description,
                "color": 14684245,
                "footer": {
                    "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/54/information-source_2139.png",
                    "text": client.translate.commands.settings.note
                },
                "fields": [
                    {
                        "name": client.translate.commands.settings.prefix,
                        "value": "```" + prefix + "prefix```\n```/prefix```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.settings.languages,
                        "value": "```" + prefix + "lang```\n```/lang```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.settings.notification,
                        "value": "```" + prefix + "notify```\n```/notify```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.settings.personal,
                        "value": "```" + prefix + "personal```\n```/personal```",
                        "inline": true
                    }
                ]
            }
        ]
    });
};

module.exports.help = {
    "name": "settings",
    "description": "See how to configure for each settings.",
    "usage": "settings",
    "category": "settings",
    "aliases": ["config", "cf", "set", "ตั้งค่า", "การตั้งค่า"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "settings",
            "th": "การตั้งค่า"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "See how to configure for each settings.",
            "th": "ดูวิธีการกำหนดค่าสำหรับแต่ละการตั้งค่า"
        }
    },
    async execute(interaction) {
        const prefix = interaction.client.config.prefix;

        await interaction.editReply({
            "embeds": [
                {
                    "title": interaction.client.translate.commands.settings.title,
                    "description": interaction.client.translate.commands.settings.description,
                    "color": "#F55179",
                    "footer": {
                        "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/54/information-source_2139.png",
                        "text": interaction.client.translate.commands.settings.note
                    },
                    "fields": [
                        {
                            "name": interaction.client.translate.commands.settings.prefix,
                            "value": "```" + prefix + "prefix```\n```/prefix```",
                            "inline": true
                        },
                        {
                            "name": interaction.client.translate.commands.settings.languages,
                            "value": "```" + prefix + "lang```\n```/lang```",
                            "inline": true
                        },
                        {
                            "name": interaction.client.translate.commands.settings.notification,
                            "value": "```" + prefix + "notify```\n```/notify```",
                            "inline": true
                        },
                        {
                            "name": interaction.client.translate.commands.settings.personal,
                            "value": "```" + prefix + "personal```\n```/personal```",
                            "inline": true
                        }
                    ]
                }
            ]
        });
    }
};