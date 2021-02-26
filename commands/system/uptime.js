module.exports.run = async function (client, message, args) {
    function duration(ms) {
        let sec = Math.floor((ms / 1000) % 60).toString();
        let min = Math.floor((ms / (1000 * 60)) % 60).toString();
        let hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        let days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        return days.padStart(1, "0") + " วัน " + hrs.padStart(2, "0") + " ชั่วโมง " + min.padStart(2, "0") + " นาที " + sec.padStart(2, "0") + " วินาที";
    }
    message.channel.send({ "embed": {
            "title": "🕒 เริ่มทำงานมาแล้ว เป็นเวลา",
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