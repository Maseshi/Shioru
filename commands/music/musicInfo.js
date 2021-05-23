module.exports.run = async function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);
        let queueName = queue.songs.map((song, id) => song.name);
        let queueURL = queue.songs.map((song, id) => song.url);
        let queueTimestamp = queue.songs.map((song, id) => song.formattedDuration);
        let queueId = queue.songs.map((song, id) => song.id);
    
        message.channel.send(client.data.language.command_music_musicInfo_info.replace("%title", queueName).replace("%timestamp", queueTimestamp).replace("%url", queueURL).replace("%id", queueId));
    } else {
        message.reply(client.data.language.command_music_musicInfo_no_queue);
    }
};

module.exports.help = {
    "name": "musicInfo",
    "description": "See information for the currently playing song",
    "usage": "musicInfo",
    "category": "music",
    "aliases": ["musicinfo", "msinfo", "musicif", "ข้อมูลเพลง", "ข้อมูลของเพลง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};