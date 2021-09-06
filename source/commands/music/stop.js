module.exports.run = function (client, message, args) {
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.stop.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.stop.not_owner);
    
    client.music.stop(message);
    message.channel.send(client.translate.commands.stop.stopped);
};

module.exports.help = {
    "name": "stop",
    "description": "Stop playing current song",
    "usage": "stop",
    "category": "music",
    "aliases": ["st", "หยุด", "หยุดเล่น"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};