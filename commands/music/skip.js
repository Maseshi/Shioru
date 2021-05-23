module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);

        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
    
        client.music.skip(message);
        message.channel.send(client.data.language.command_music_skip_info);
    } else {
        message.reply(client.data.language.command_music_skip_no_queue);
    }
};

module.exports.help = {
    "name": "skip",
    "description": "Skip songs being played",
    "usage": "skip",
    "category": "music",
    "aliases": ["sk", "ข้าม"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};