module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.reply(client.lang.command_music_pause_no_queue);
    
    let queueOwner = serverQueue.require.username;
    if (message.author.username !== queueOwner) return message.reply(client.lang.command_music_pause_check_not_owner);

    if (serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        serverQueue.textChannel.send(client.lang.command_music_pause_info);
    } else {
        message.channel.send(client.lang.command_music_pause_cant_pause);
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