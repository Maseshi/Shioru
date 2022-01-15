module.exports.run = (client, message, args) => {
    const duration = (ms) => {
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        return days.padStart(1, "0") + " " + client.translate.commands.uptime.days + " " +
            hrs.padStart(2, "0") + " " + client.translate.commands.uptime.hours + " " +
            min.padStart(2, "0") + " " + client.translate.commands.uptime.minute + " " +
            sec.padStart(2, "0") + " " + client.translate.commands.uptime.second + " ";
    }
    
    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.uptime.info_title,
                "description": "```" + duration(client.uptime) + "```",
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
    "aliases": ["upTime", "upTimes", "uptimes", "เวลา"],
    "clientPermissions": ["SEND_MESSAGES"]
};