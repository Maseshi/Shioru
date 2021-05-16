module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    let queueOwner = serverQueue.require.username;
    
    if (!serverQueue) return message.reply(client.lang.command_music_musicInfo_no_queue);
    if (queueOwner !== message.author.username) return message.reply(client.lang.command_music_musicInfo_check_not_owner);

    message.channel.send(client.lang.command_music_musicInfo_info.replace("%title", (serverQueue.songs[0].title)).replace("%timestamp", (serverQueue.songs[0].timestamp || client.lang.command_music_musicInfo_info_unknown)).replace("%url", (serverQueue.songs[0].url)).replace("%id", (serverQueue.songs[0].id)));
};

module.exports.help = {
    "name": "musicInfo",
    "description": "See information for the currently playing song",
    "usage": "musicInfo",
    "category": "music",
    "aliases": ["musicinfo", "msinfo", "musicif", "ข้อมูลเพลง", "ข้อมูลของเพลง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};