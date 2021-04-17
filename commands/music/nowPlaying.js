module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_nowPlaying_no_queue);
    } else {
        message.channel.send(client.lang.command_music_nowPlaying_info.replace("%title", (serverQueue.songs[0].title)));
    }
};

module.exports.help = {
    "name": "nowplaying",
    "description": "Check the music that is currently playing.",
    "usage": "nowplaying",
    "category": "music",
    "aliases": ["np", "กำลังเล่น"]
};