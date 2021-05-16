module.exports.run = function (client, message, args) {
    let volume = parseInt(args[0]);
    let serverQueue = message.client.data.get(message.guild.id);
    let queueOwner = serverQueue.require.username;
    
    if (!serverQueue) return message.reply(client.lang.command_music_volume_no_queue);
    if (queueOwner !== message.author.username) return message.reply(client.lang.command_music_volume_check_not_owner);
    
    if (!volume) return message.reply(client.lang.command_music_volume_current_level_sound.replace("%currentLevel", serverQueue.volume));
    if (volume >= 101) return message.reply(client.lang.command_music_volume_too_loud);
    if (volume <= 0) return message.reply(client.lang.command_music_volume_too_light);

    serverQueue.volume = volume;
    serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 100);
    message.channel.send(client.lang.command_music_volume_info.replace("%level", volume));
};

module.exports.help = {
    "name": "volume",
    "description": "Adjust the music volume",
    "usage": "volume <number>",
    "category": "music",
    "aliases": ["vl", "ระดับเสียง", "ระดับเพลง", "ปรับเสียง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};