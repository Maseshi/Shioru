module.exports.run = (client, message, args) => {
    const inputTime = parseInt(args[0]);
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.seek.no_queue);

    const queueDuration = queue.songs.map((song, id) => song.duration);
    const queueFormatDuration = queue.songs.map((song, id) => song.formatDuration);

    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.seek.not_owner);
    if (!inputTime) return message.reply(client.translate.commands.seek.seek_guide.replace("%s", queueDuration));
    if (inputTime <= 0) return message.reply(client.translate.commands.seek.too_little);
    if (inputTime >= queueDuration) return message.reply(client.translate.commands.seek.too_much.replace("%s", queueFormatDuration));

    client.music.seek(message, (inputTime * 1000));
    message.channel.send(client.translate.commands.seek.sought);
};

module.exports.help = {
    "name": "seek",
    "description": "Change the duration of the currently playing song",
    "usage": "seek <time>",
    "category": "music",
    "aliases": ["ช่วง", "duration"],
    "clientPermissions": ["SEND_MESSAGES"]
};