module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    let queueOwner = serverQueue.require.username;
    
    if (!serverQueue) return message.reply(client.lang.command_music_pause_no_queue);
    if (serverQueue.playing) {
        if (queueOwner !== message.author.username) return message.reply(client.lang.command_music_pause_check_not_owner);
        
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send(client.lang.command_music_pause_info);
    }
    
    message.channel.send(client.lang.command_music_pause_cant_pause);
};

module.exports.help = {
    "name": "pause",
    "description": "Pause music",
    "usage": "pause",
    "category": "music",
    "aliases": ["pu", "หยุดชั่วคราว"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};