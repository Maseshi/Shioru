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
            message.reply("❎ เอ๋...ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ หยุดไม่ได้น้าา... (ใช่หยุดที่ฉันคิดหรือเปล่า เอ๋?)")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            message.channel.send("⏹️ หยุดเล่นเพลงแล้วคะ");
            client.user.setPresence({
                //"available", "idle", "dnd", or "invisible"
                "status": "available",
                "activity": {
                    "name": client.config.prefix + "help ดูคำสั่งทั้งหมด",
                    "type": 'WATCHING',
                    "url": "https://youtube.com/watch?v=OLd68rtX6mI"
                }
            });
        }
    }
};

module.exports.help = {
    "name": "stop",
    "description": "Stop playing current song",
    "usage": "Ystop",
    "category": "music",
    "aliases": ["st", "หยุด", "หยุดเล่น"]
};