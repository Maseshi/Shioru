module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.reply(client.lang.command_music_stop_no_queue);

    let queueOwner = serverQueue.require.username;
    if (queueOwner !== message.author.username) return message.reply(client.lang.command_music_stop_check_not_owner);

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.channel.send(client.lang.command_music_stop_info);
};

module.exports.help = {
    "name": "stop",
    "description": "Stop playing current song",
    "usage": "stop",
    "category": "music",
    "aliases": ["st", "หยุด", "หยุดเล่น"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};