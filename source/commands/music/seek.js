module.exports.run = function (client, message, args) {
    let seek = parseInt(args[0]);
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.seek.no_queue);

    let queueDuration = queue.songs.map((song, id) => song.duration);
    let queueFormatDuration = queue.songs.map((song, id) => song.formatDuration);

    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.seek.not_owner);
    if (!seek) return message.reply(client.translate.commands.seek.seek_guide.replace("%s", queueDuration));
    if (seek <= 0) return message.reply(client.translate.commands.seek.too_little);
    if (seek >= queueDuration) return message.reply(client.translate.commands.seek.too_much.replace("%s", queueFormatDuration));

    client.music.seek(message, (seek * 1000));
    message.channel.send(client.translate.commands.seek.sought);
};

module.exports.help = {
    "name": "seek",
    "description": "Change the duration of the currently playing song",
    "usage": "seek <time>",
    "category": "music",
    "aliases": ["ช่วง", "duration"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};