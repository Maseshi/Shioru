module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.previous.no_queue);
    if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.previous.not_owner);
    if (!queue.previousSongs) return message.reply(client.translate.commands.previous.no_previous_song_queue);

    client.music.previous(message);
    message.channel.send(client.translate.commands.previous.previous);
};

module.exports.help = {
    "name": "previous",
    "description": "previous music",
    "usage": "previous",
    "category": "music",
    "aliases": ["pv", "เพลงก่อนหน้า"],
    "clientPermissions": ["SEND_MESSAGES", "CONNECT"]
};