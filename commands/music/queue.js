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
        let songName = serverQueue.songs[0].title;
        let queue = serverQueue.songs.map(song => "• " + song.title).join("\n");
        let embed = {
            "title": "รายการเพลงทั้งหมด",
            "description": "**กำลังเล่น:** \n```" + songName + "```\n**เพลงในคิว:** \n`" + queue + "` \n",
            "color": 4886754,
            "footer": {
                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/videocassette_1f4fc.png",
                "text": "ตัวเล่นเพลง"
            }
        };
        message.channel.send({ embed });
    }
};

module.exports.help = {
    "name": "queue",
    "description": "Check songs in the queue",
    "usage": "Yqueue",
    "category": "music",
    "aliases": ["q", "คิว"]
};