module.exports.run = function (client, message, args) {
    let percent = parseInt(args[0]);
    let queue = client.music.getQueue(message);
    
    if (!queue) return message.channel.send(client.translate.commands.volume.no_queue);

    let queueVolume = queue.volume;
    
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.volume.not_owner);
    if (!percent) return message.reply(client.translate.commands.volume.this_volume.replace("%s", queueVolume));
    if (percent <= 0) return message.reply(client.translate.commands.volume.too_little);
    if (percent >= 101) return message.reply(client.translate.commands.volume.too_much);

    client.music.setVolume(message, percent);
    message.channel.send(client.translate.commands.volume.adjusted.replace("%s", percent));
};

module.exports.help = {
    "name": "volume",
    "description": "Adjust the music volume",
    "usage": "volume <number>",
    "category": "music",
    "aliases": ["vl", "ระดับเสียง", "ระดับเพลง", "ปรับเสียง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};