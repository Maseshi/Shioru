module.exports.run = (client, message, args) => {
    const authorUsername = message.author.username;

    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description": client.translate.commands.dead.suicide.replace("%s", authorUsername)
            }
        ]
    });
};

module.exports.help = {
    "name": "dead",
    "description": "Fake message that says you commit suicide.",
    "usage": "dead",
    "category": "fun",
    "aliases": ["die", "dead", "ตาย", "เสียชีวิต"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "dead",
            "th": "เสียชีวิต"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Fake message that says you commit suicide.",
            "th": "ข้อความปลอมที่บอกว่าคุณฆ่าตัวตาย!"
        }
    },
    async execute(interaction) {
        const authorUsername = interaction.user.username;

        await interaction.editReply({
            "embeds": [
                {
                    "color": 1,
                    "description": interaction.client.translate.commands.dead.suicide.replace("%s", authorUsername)
                }
            ]
        });
    }
};