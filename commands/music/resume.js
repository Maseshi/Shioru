module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing === undefined) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        message.channel.send('▶️ กำลังเล่นเพลงต่อจากจุดเดิมแล้วคะ');
        client.user.setPresence({
            //"available", "idle", "dnd", or "invisible"
            "status": "available",
            "activity": {
                "name": "🎶 เพลง: " + serverQueue.songs[0].title,
                "type": 'PLAYING'
            }
        });
    } else {
        message.reply("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ ไปต่อไม่ได้ด้วย")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    }
};

module.exports.help = {
    "name": "resume",
    "description": "resume playing the current song",
    "usage": "Yresume",
    "category": "music",
    "aliases": ["rs", "เล่นต่อ", "ต่อ"]
};