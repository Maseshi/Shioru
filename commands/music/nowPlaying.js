module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send("❎ ตอนนี้ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ");
    } else {
        message.channel.send("🎶 ตอนนี้ฉันกำลังเล่นเพลง: **" + serverQueue.songs[0].title + "**");
    }
};

module.exports.help = {
    "name": "nowplaying",
    "description": "Check the music that is currently playing.",
    "usage": "nowplaying",
    "category": "music",
    "aliases": ["np", "กำลังเล่น"]
};