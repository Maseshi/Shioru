module.exports.run = function (client, message, args) {
    let channel = message.member.voice.channel;
    if (channel === undefined) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue === undefined) {
            message.reply("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ ข้ามไม่ได้อ่ะ")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            serverQueue.connection.dispatcher.end();
            message.channel.send("〰️ ข้ามไปแล้วคะ!!");
            if (serverQueue) {
                client.user.setPresence({
                    //"available", "idle", "dnd", or "invisible"
                    "status": "available",
                    "activity": {
                        "name": "🎶 ข้ามไปที่เพลง: " + serverQueue.songs[0].title,
                        "type": 'PLAYING'
                    }
                });
            }
        }
    }
};

module.exports.help = {
    "name": "skip",
    "description": "Skip songs being played",
    "usage": "Yskip",
    "category": "music",
    "aliases": ["sk", "ข้าม"]
};