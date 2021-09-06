module.exports.run = function (client, message, args) {
    let loop = parseInt(args[0]);
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.repeat.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.repeat.not_owner);
    if (!loop) return message.reply(client.translate.commands.repeat.repeat_guide);
    if (loop <= 0) return message.reply(client.translate.commands.repeat.too_little);
    if (loop >= 2) return message.reply(client.translate.commands.repeat.too_much);

    let mode = client.music.setRepeatMode(message, loop);
    message.channel.send(client.translate.commands.repeat.repeated.replace("%s", (mode = mode ? mode == 2 ? client.translate.commands.repeat.repeat_queue : client.translate.commands.repeat.repeat_song : client.translate.commands.repeat.off)));
};

module.exports.help = {
    "name": "repeat",
    "description": "Toggle music repeat",
    "usage": "repeat <mode: 0, 1, 2>",
    "category": "music",
    "aliases": ["loop", "วน", "ทำซ้ำ"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};