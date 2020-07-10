module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue === undefined) {
        message.reply("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        message.channel.send("🎶 ตอนนี้ฉันกำลังเล่นเพลง: **" + serverQueue.songs[0].title + "**");
    }
};

module.exports.help = {
    "name": "nowPlaying",
    "description": "Check the music that is currently playing.",
    "usage": "YnowPlaying",
    "category": "music",
    "aliases": ["np", "กำลังเล่น"]
};