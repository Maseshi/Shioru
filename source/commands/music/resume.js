module.exports.run = function (client, message, args) {
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.resume.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.resume.not_owner);
    if (queue.paused) return message.reply(client.translate.commands.resume.now_playing);

    client.music.resume(message);
    message.channel.send(client.translate.commands.resume.resumed);
};

module.exports.help = {
    "name": "resume",
    "description": "resume playing the current song",
    "usage": "resume",
    "category": "music",
    "aliases": ["rs", "เล่นต่อ", "ต่อ"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};