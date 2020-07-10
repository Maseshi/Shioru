module.exports.run = function (client, message, args) {
    let serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        message.channel.send('⏸ หยุดเล่นเพลงชั่วคราวแล้วคะ');
        client.user.setPresence({
            //"available", "idle", "dnd", or "invisible"
            "status": "available",
            "activity": {
                "name": "⏸ หยุดเล่นชั่วคราว: " + serverQueue.songs[0].title,
                "type": 'PLAYING'
            }
        });
    } else {
        message.reply("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ แล้วก็หยุดชั่วคราวไม่ได้ด้วย")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    }
};

module.exports.help = {
    "name": "pause",
    "description": "",
    "usage": "Ypause",
    "category": "music",
    "aliases": ["pu", "หยุดชั่วคราว"]
};