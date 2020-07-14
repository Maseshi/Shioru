const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ");
    } else {
        if (!serverQueue.playing) {
            if (!check(message.member)) {
                message.channel.send("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้");
            } else {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                message.channel.send('▶️ กำลังเล่นเพลงต่อจากจุดเดิมแล้วคะ');
            }
        } else {
            message.channel.send("📼 ตอนนี้ฉันก็กำลังเล่นอยู่นะ เหห...");
        }
    }
};

module.exports.help = {
    "name": "resume",
    "description": "resume playing the current song",
    "usage": "Yresume",
    "category": "music",
    "aliases": ["rs", "เล่นต่อ", "ต่อ"]
};