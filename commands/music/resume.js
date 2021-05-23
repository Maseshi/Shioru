module.exports.run = function (client, message, args) {
    if (!client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);

        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!client.music.isPaused(message)) return message.reply("❎ ตอนนี้ก็กำลังเล่นเพลงอยู่นะ");
    
        client.music.resume(message);
        message.channel.send(client.data.language.command_music_resume_info);
    } else {
        message.reply(client.data.language.command_music_resume_now_playing);
    }
};

module.exports.help = {
    "name": "resume",
    "description": "resume playing the current song",
    "usage": "resume",
    "category": "music",
    "aliases": ["rs", "เล่นต่อ", "ต่อ"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};