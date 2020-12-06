const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ");
    } else {
        let serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) {
            message.channel.send("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ ข้ามไม่ได้อ่ะ");
        } else {
            if (!check(message.member)) {
                message.channel.send("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้");
            } else {
                serverQueue.connection.dispatcher.end();
                message.channel.send("⏭ ข้ามแล้วคะและกำลังจะเริ่มเล่นเพลงใหม่ในคิว");
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