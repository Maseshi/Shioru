module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);

        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
    
        client.music.stop(message);
        message.channel.send(client.data.language.command_music_stop_info);
    } else {
        message.reply(client.data.language.command_music_stop_no_queue);
    }
};

module.exports.help = {
    "name": "stop",
    "description": "Stop playing current song",
    "usage": "stop",
    "category": "music",
    "aliases": ["st", "หยุด", "หยุดเล่น"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};