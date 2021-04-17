module.exports.run = async function (client, message, args) {
    function duration(ms) {
        let sec = Math.floor((ms / 1000) % 60).toString();
        let min = Math.floor((ms / (1000 * 60)) % 60).toString();
        let hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        let days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        return  days.padStart(1, "0") + client.lang.command_system_uptime_create_data_day +
                hrs.padStart(2, "0") + client.lang.command_system_uptime_create_data_hour +
                min.padStart(2, "0") + client.lang.command_system_uptime_create_data_minute +
                sec.padStart(2, "0") + client.lang.command_system_uptime_create_data_second;
    }
    message.channel.send({ "embed": {
            "title": client.lang.command_system_uptime_embed_title,
            "description": "```" + duration(client.uptime) + "```",
            "color": 14684245,
        }
    });
};

module.exports.help = {
    "name": "uptime",
    "description": "Displays the bots current uptime!",
    "usage": "uptime",
    "category": "system",
    "aliases": ["upTime", "upTimes", "uptimes", "เวลา"]
};