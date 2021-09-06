module.exports.run = function (client, message, args) {
    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.uptime.info_title,
                "description": "```" + duration(client.uptime) + "```",
                "color": 14684245
            }
        ]
    });

    function duration(ms) {
        let sec = Math.floor((ms / 1000) % 60).toString();
        let min = Math.floor((ms / (1000 * 60)) % 60).toString();
        let hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        let days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        return  days.padStart(1, "0") + " " + client.translate.commands.days + " " +
                hrs.padStart(2, "0") + " " + client.translate.commands.hours + " " +
                min.padStart(2, "0") + " " + client.translate.commands.minute + " " +
                sec.padStart(2, "0") + " " + client.translate.commands.second + " ";
    }
};

module.exports.help = {
    "name": "uptime",
    "description": "Displays the bots current uptime!",
    "usage": "uptime",
    "category": "developer",
    "aliases": ["upTime", "upTimes", "uptimes", "เวลา"],
    "permissions": "SEND_MESSAGES"
};