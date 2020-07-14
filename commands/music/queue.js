module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ");
    } else {
        let queue = serverQueue.songs.map((song, index) => (index + 1) + ". " + song.title).join("\n");
        let embed = {
            "title": "เพลงในคิวทั้งหมด",
            "description": queue,
            "color": 4886754,
            "timestamp": serverQueue.require.timestamp,
            "footer": {
                "icon_url": serverQueue.require.avatar,
                "text": serverQueue.require.username + " คือเจ้าของคิวนี้"
            }
        };
        message.channel.send({ embed });
    }
};

module.exports.help = {
    "name": "queue",
    "description": "Check songs in the queue",
    "usage": "Yqueue",
    "category": "music",
    "aliases": ["q", "คิว"]
};