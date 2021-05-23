module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);
        let queueName = queue.songs.map((song, id) => song.name);
    
        message.channel.send(client.data.language.command_music_nowPlaying_info.replace("%title", queueName));
    } else {
        message.reply(client.data.language.command_music_nowPlaying_no_queue);
    }
};

module.exports.help = {
    "name": "nowPlaying",
    "description": "Check the music that is currently playing.",
    "usage": "nowPlaying",
    "category": "music",
    "aliases": ["nowplaying", "np", "กำลังเล่น"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};