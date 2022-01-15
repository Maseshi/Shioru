module.exports.run = (client, message, args) => {
    let queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.skip.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.skip.not_owner);
    
    client.music.skip(message);
    message.channel.send(client.translate.commands.skip.skipped);
};

module.exports.help = {
    "name": "skip",
    "description": "Skip songs being played",
    "usage": "skip",
    "category": "music",
    "aliases": ["sk", "ข้าม"],
    "clientPermissions": ["SEND_MESSAGES"]
};