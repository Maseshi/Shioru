module.exports.run = (client, message, args) => {
    const inputPercent = parseInt(args[0]);
    const queue = client.music.getQueue(message);
    
    if (!queue) return message.reply(client.translate.commands.volume.no_queue);

    const queueVolume = queue.volume;
    
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.volume.not_owner);
    if (!inputPercent) return message.reply(client.translate.commands.volume.this_volume.replace("%s", queueVolume));
    if (inputPercent <= 0) return message.reply(client.translate.commands.volume.too_little);
    if (inputPercent >= 101) return message.reply(client.translate.commands.volume.too_much);

    client.music.setVolume(message, inputPercent);
    message.channel.send(client.translate.commands.volume.adjusted.replace("%s", inputPercent));
};

module.exports.help = {
    "name": "volume",
    "description": "Adjust the music volume",
    "usage": "volume <number>",
    "category": "music",
    "aliases": ["vl", "ระดับเสียง", "ระดับเพลง", "ปรับเสียง"],
    "clientPermissions": ["SEND_MESSAGES"]
};