const check = require("../../structures/modifyQueue");

module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ");
    } else {
        if (!check(message.member)) {
            message.channel.send("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้");
        } else {
            if (!args.length) {
                message.reply("พิพม์: " + message.client.prefix + "remove <คิวเพลงที่>");
            } else {
                if (isNaN(args[0])) {
                    message.reply("พิพม์: " + message.client.prefix + "remove <คิวเพลงที่>");
                } else {
                    let song = serverQueue.songs.splice(args[0] - 1, 1);
                    serverQueue.textChannel.send("❌ ลบ **" + song[0].title + "** ออกจากคิวแล้วคะ.");
                }
            }
        }
    }
};

module.exports.help = {
    "name": "remove",
    "description": "Remove song from the queue",
    "usage": "remove <queue number>",
    "category": "music",
    "aliases": ["rm", "rq", "ลบ", "ลบคิว"]
};