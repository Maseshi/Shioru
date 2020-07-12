const check = require("../../util/modifyQueue");

module.exports.run = function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) {
            message.reply("❎ เอ๋...ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ หยุดไม่ได้น้าา... (ใช่หยุดที่ฉันคิดหรือเปล่า เอ๋?)")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            if (!check(message.member)) {
                message.reply("🚫 ใจเย็นๆ คนอื่นเขากำลังฟังอยู่น้าา...")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
            } else {
                serverQueue.songs = [];
                serverQueue.connection.dispatcher.end();
                message.channel.send("⏹️ หยุดเล่นเพลงและลบคิวทั้งหมดออกแล้วคะ");
            }
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