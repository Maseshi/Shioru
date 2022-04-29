module.exports.run = (client, message, args) => {
    const ms = client.uptime;
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
    const duration = days.padStart(1, "0") + " " + client.translate.commands.uptime.days + " " +
        hrs.padStart(2, "0") + " " + client.translate.commands.uptime.hours + " " +
        min.padStart(2, "0") + " " + client.translate.commands.uptime.minute + " " +
        sec.padStart(2, "0") + " " + client.translate.commands.uptime.second + " ";

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.uptime.info_title,
                "description": "```" + duration + "```",
                "color": 14684245
            }
        ]
    });
};

module.exports.help = {
    "name": "uptime",
    "description": "Displays the bots current uptime!",
    "usage": "uptime",
    "category": "developer",
    "aliases": ["uptimes", "เวลา"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "uptime",
            "th": "เวลาทำงาน"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Displays the bots current uptime!",
            "th": "แสดงเวลาทำงานของบอทในปัจจุบัน!"
        }
    },
    async execute(interaction) {
        const ms = interaction.client.uptime;
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        const duration = days.padStart(1, "0") + " " + interaction.client.translate.commands.uptime.days + " " +
            hrs.padStart(2, "0") + " " + interaction.client.translate.commands.uptime.hours + " " +
            min.padStart(2, "0") + " " + interaction.client.translate.commands.uptime.minute + " " +
            sec.padStart(2, "0") + " " + interaction.client.translate.commands.uptime.second + " ";

        await interaction.editReply({
            "embeds": [
                {
                    "title": interaction.client.translate.commands.uptime.info_title,
                    "description": "```" + duration + "```",
                    "color": 14684245
                }
            ]
        });
    }
};