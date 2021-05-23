module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let percent = parseInt(args[0]);
        let queue = client.music.getQueue(message);
        let queueVolume = queue.volume;
    
        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!percent) return message.reply(client.data.language.command_music_volume_current_level_sound.replace("%currentLevel", queueVolume));
        if (percent >= 101) return message.reply(client.data.language.command_music_volume_too_loud);
        if (percent <= 0) return message.reply(client.data.language.command_music_volume_too_light);
    
        client.music.setVolume(message, percent);
        message.channel.send(client.data.language.command_music_volume_info.replace("%level", percent));
    } else {
        message.reply(client.data.language.command_music_volume_no_queue);
    }
};

module.exports.help = {
    "name": "volume",
    "description": "Adjust the music volume",
    "usage": "volume <number>",
    "category": "music",
    "aliases": ["vl", "ระดับเสียง", "ระดับเพลง", "ปรับเสียง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};