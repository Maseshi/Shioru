module.exports.run = (client, message, args) => {
    const inputID = parseInt(args[0]);
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.repeat.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.repeat.not_owner);
    if (!inputID) return message.reply(client.translate.commands.repeat.repeat_guide);
    if (inputID <= 0) return message.reply(client.translate.commands.repeat.too_little);
    if (inputID >= 2) return message.reply(client.translate.commands.repeat.too_much);

    const mode = client.music.setRepeatMode(message, inputID);
    message.channel.send(client.translate.commands.repeat.repeated.replace("%s", (mode ? mode == 2 ? client.translate.commands.repeat.repeat_queue : client.translate.commands.repeat.repeat_song : client.translate.commands.repeat.off)));
};

module.exports.help = {
    "name": "repeat",
    "description": "Toggle music repeat",
    "usage": "repeat <mode: 0, 1, 2>",
    "category": "music",
    "aliases": ["loop", "วน", "ทำซ้ำ"],
    "clientPermissions": ["SEND_MESSAGES"]
};