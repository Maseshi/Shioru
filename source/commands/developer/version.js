const { version } = require('../../../package.json');

module.exports.run = (client, message, args) => {
    message.channel.send({
        "embeds": [
            {
                "description": client.translate.commands.version.working_in_version.replace("%s", version),
                "color": "#8FCE00"
            }
        ]
    });
}

module.exports.help = {
    "name": "version",
    "description": "Check the current bot version.",
    "usage": "version",
    "category": "developer",
    "aliases": ["v", "เวอร์ชั่น"],
    "clientPermissions": ["SEND_MESSAGES"]
}

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "version",
            "th": "รุ่น"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Check the current bot version.",
            "th": "ตรวจสอบเวอร์ชันของบอทในปัจจุบัน!"
        }
    },
    async execute(interaction) {
        await interaction.editReply({
            "embeds": [
                {
                    "description": interaction.client.translate.commands.version.working_in_version.replace("%s", version),
                    "color": "#8FCE00"
                }
            ]
        });
    }
};