module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.reply(client.lang.command_music_nowPlaying_no_queue);
    
    message.channel.send(client.lang.command_music_nowPlaying_info.replace("%title", (serverQueue.songs[0].title)));
};

module.exports.help = {
    "name": "nowPlaying",
    "description": "Check the music that is currently playing.",
    "usage": "nowPlaying",
    "category": "music",
    "aliases": ["nowplaying", "np", "กำลังเล่น"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};