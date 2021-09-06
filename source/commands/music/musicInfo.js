module.exports.run = function (client, message, args) {
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.musicInfo.no_queue);
    
    let queueName = queue.songs.map((song, id) => song.name);
    let queueURL = queue.songs.map((song, id) => song.url);
    let queueTimestamp = queue.songs.map((song, id) => song.formattedDuration);
    let queueId = queue.songs.map((song, id) => song.id);

    message.channel.send(client.translate.commands.musicInfo.detail.replace("%s1", queueName).replace("%s2", queueTimestamp).replace("%s3", queueURL).replace("%s4", queueId));
};

module.exports.help = {
    "name": "musicInfo",
    "description": "See information for the currently playing song",
    "usage": "musicInfo",
    "category": "music",
    "aliases": ["musicinfo", "msinfo", "musicif", "ข้อมูลเพลง", "ข้อมูลของเพลง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};