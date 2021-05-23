module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);

        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
    
        client.music.shuffle(message);
        message.channel.send(client.data.language.command_music_shuffle_info);
    } else {
        message.reply(client.data.language.command_music_shuffle_no_queue);
    }
};

module.exports.help = {
    "name": "shuffle",
    "description": "Shuffle queue",
    "usage": "shuffle",
    "category": "music",
    "aliases": ["shf", "สับเปลี่ยน", "สลับ", "เปลี่ยน"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};