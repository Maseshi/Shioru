const check = require("../../util/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
        message.reply("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ หยุดเพลงตอนนี้ก็ไม่ได้ด้วย")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
    } else {
        if (serverQueue.playing) {
            if (!check(message.member)) {
                message.reply("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
            } else {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                message.channel.send('⏸ หยุดเล่นเพลงชั่วคราวแล้วคะ');
            }
        } else {
            message.reply("📼 ตอนนี้ฉันก็หยุดอยู่นะ วันนี้ดูแปลกๆ แฮ่ะ..")
                .then(function (msg) {
                    msg.delete({
                        timeout: 10000
                    });
                });
        }
    }
};

module.exports.help = {
    "name": "pause",
    "description": "",
    "usage": "Ypause",
    "category": "music",
    "aliases": ["pu", "หยุดชั่วคราว"]
};