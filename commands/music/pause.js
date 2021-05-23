module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);

        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (client.music.isPaused(message)) return message.reply("❎ ตอนนี้ก็กำลังหยุดเล่นเพลงอยู่นะ");
    
        client.music.pause(message);
        message.channel.send(client.data.language.command_music_pause_info);
    } else {
        message.reply(client.data.language.command_music_pause_cant_pause);
    }
};

module.exports.help = {
    "name": "pause",
    "description": "Pause music",
    "usage": "pause",
    "category": "music",
    "aliases": ["pu", "หยุดชั่วคราว"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};