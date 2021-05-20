module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.channel.send(client.lang.command_music_resume_no_queue);

    let queueOwner = serverQueue.require.username;
    if (queueOwner !== message.author.username) return message.channel.send(client.lang.command_music_resume_check_not_owner);
    
    if (!serverQueue.playing) {
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