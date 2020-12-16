const check = require("../../structures/modifyQueue");

module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ");
    } else {
        if (!check(message.member)) {
            message.channel.send("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะดูข้อมูลเพลงนี้ได้");
        } else {
            message.channel.send("📄__ รายละเอียด__\n• เพลง: **" + serverQueue.songs[0].title + "**\n• ระยะเวลา: **" + (serverQueue.songs[0].timestamp || "ไม่ทราบ") + "**\n• ลิงค์เพลง: **" + serverQueue.songs[0].url + "**\n• ไอดีเพลง: **" + serverQueue.songs[0].id + "**");
        }
    }
};

module.exports.help = {
    "name": "musicinfo",
    "description": "See information for the currently playing song",
    "usage": "musicinfo",
    "category": "music",
    "aliases": ["msinfo", "musicif", "ข้อมูลเพลง", "ข้อมูลของเพลง"]
};