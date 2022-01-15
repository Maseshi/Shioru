module.exports.run = (client, message, args) => {
    const inputAmount = parseInt(args[0]);
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.remove.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.remove.not_owner);
    if (!inputAmount) return message.reply(client.translate.commands.remove.remove_guide.replace("%s", (client.config.prefix + module.exports.help.name)));
    if (inputAmount <= 0) return message.reply(client.translate.commands.remove.too_little);
    if (inputAmount >= queue.songs.length) return message.reply(client.translate.commands.remove.too_much);
    
    if (inputAmount === 1) {
        client.music.skip(message);
        message.channel.send(client.translate.commands.remove.single_queue);
    } else {
        const song = queue.songs.splice(inputAmount - 1, 1);
        message.channel.send(client.translate.commands.remove.removed.replace("%s", song[0].name));
    }
};

module.exports.help = {
    "name": "remove",
    "description": "Remove song from the queue",
    "usage": "remove <number>",
    "category": "music",
    "aliases": ["rm", "rq", "ลบ", "ลบคิว"],
    "clientPermissions": ["SEND_MESSAGES"]
};