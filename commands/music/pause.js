const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ หยุดเพลงตอนนี้ก็ไม่ได้ด้วย");
    } else {
        if (serverQueue.playing) {
            if (!check(message.member)) {
                message.channel.send("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้");
            } else {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                message.channel.send('⏸ หยุดเล่นเพลงชั่วคราวแล้วคะ');
            }
        } else {
            message.channel.send("📼 ตอนนี้ฉันก็หยุดอยู่นะ วันนี้ดูแปลกๆ แฮ่ะ..");
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