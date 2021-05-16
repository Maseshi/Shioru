module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    let queueOwner = serverQueue.require.username;
    
    if (!serverQueue) return message.channel.send(client.lang.command_music_resume_no_queue);
    if (!serverQueue.playing) {
        if (queueOwner !== message.author.username) return message.channel.send(client.lang.command_music_resume_check_not_owner);
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send(client.lang.command_music_resume_info);
    }
    
    serverQueue.textChannel.send(client.lang.command_music_resume_now_playing);
};

module.exports.help = {
    "name": "resume",
    "description": "resume playing the current song",
    "usage": "resume",
    "category": "music",
    "aliases": ["rs", "เล่นต่อ", "ต่อ"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};