module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.shuffle.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.shuffle.not_owner);
    
    client.music.shuffle(message);
    message.channel.send(client.translate.commands.shuffle.now_shuffle);
};

module.exports.help = {
    "name": "shuffle",
    "description": "Shuffle queue",
    "usage": "shuffle",
    "category": "music",
    "aliases": ["shf", "สับเปลี่ยน", "สลับ", "เปลี่ยน"],
    "clientPermissions": ["SEND_MESSAGES"]
};