module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.musicInfo.no_queue);
    
    const queueName = queue.songs.map((song, id) => song.name);
    const queueURL = queue.songs.map((song, id) => song.url);
    const queueTimestamp = queue.songs.map((song, id) => song.formattedDuration);
    const queueId = queue.songs.map((song, id) => song.id);

    message.channel.send(client.translate.commands.musicInfo.detail.replace("%s1", queueName).replace("%s2", queueTimestamp).replace("%s3", queueURL).replace("%s4", queueId));
};

module.exports.help = {
    "name": "musicInfo",
    "description": "See information for the currently playing song",
    "usage": "musicInfo",
    "category": "music",
    "aliases": ["musicinfo", "msinfo", "musicif", "ข้อมูลเพลง", "ข้อมูลของเพลง"],
    "clientPermissions": ["SEND_MESSAGES"]
};