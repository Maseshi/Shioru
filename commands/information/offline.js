module.exports.run = async function (client, message, args) {
    let offlineCount = message.guild.members.cache.filter(member => member.presence.status === "offline").size;
    let icon = message.guild.iconURL();

    let embed = {
        "description": "สมาชิกที่ออฟไลน์อยู่ในขณะนี้ คือ \n```" + offlineCount + "```",
        "color": 10197915,
        "footer": {
            "icon_url": icon,
            "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์",
        }
    };
    message.channel.send({
        embed
    });
};

module.exports.help = {
    "name": "offline",
    "description": "View currently offline members.",
    "usage": "Yoffline",
    "category": "information",
    "aliases": ["memberOffline", "off", "mOff", "สมาชิกออฟไลน์", "ออฟ", "ออฟไลน์"]
};