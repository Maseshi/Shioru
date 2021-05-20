module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.reply(client.lang.command_music_skip_no_queue);

    let queueOwner = serverQueue.require.username;
    if (message.author.username !== queueOwner) return message.reply(client.lang.command_music_skip_check_not_owner);
    
    if (serverQueue.connection.dispatcher) {
        serverQueue.connection.dispatcher.end();
        serverQueue.textChannel.send(client.lang.command_music_skip_info);
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