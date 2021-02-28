const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ เอ๋...ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ");
    } else {
        if (!check(message.member)) {
            message.channel.send("🚫 ใจเย็นๆ คนอื่นเขากำลังฟังอยู่น้าา...");
        } else {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            message.channel.send("⏹️ หยุดเล่นเพลงและลบคิวทั้งหมดออกแล้วคะ");
        }
    }
};

module.exports.help = {
    "name": "stop",
    "description": "Stop playing current song",
    "usage": "stop",
    "category": "music",
    "aliases": ["st", "หยุด", "หยุดเล่น"]
};