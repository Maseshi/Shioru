const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ ข้ามไม่ได้อ่ะ");
    } else {
        if (!check(message.member)) {
            message.channel.send("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้");
        } else {
            if (isNaN(args[0])) {
                message.reply("❓ ต้องการข้ามไปที่เพลงเลขที่อะไรเหรอคะ");
            } else {
                serverQueue.playing = true;
                serverQueue.songs = serverQueue.songs.slice(args[0] - 2);
                serverQueue.connection.dispatcher.end();
                serverQueue.textChannel.send("⏭ ข้ามไป " + (args[0] - 1) + " เพลง...");
            }
        }
    }
};

module.exports.help = {
    "name": "skipto",
    "description": "Skip to the selected queue number",
    "usage": "skipto <queue number>",
    "category": "music",
    "aliases": ["skt", "ข้ามไปที่"]
};