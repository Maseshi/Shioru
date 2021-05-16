module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    let queueOwner = serverQueue.require.username;
    
    if (!serverQueue) return message.reply(client.lang.command_music_shuffle_no_queue);
    if (queueOwner !== message.author.username) return message.reply(client.lang.command_music_shuffle_check_not_owner);

    let songs = serverQueue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
        let j = 1 + Math.floor(Math.random() * i);
        [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    serverQueue.songs = songs;
    message.client.data.set(message.guild.id, serverQueue);
    message.channel.send(client.lang.command_music_shuffle_info);
};

module.exports.help = {
    "name": "shuffle",
    "description": "Shuffle queue",
    "usage": "shuffle",
    "category": "music",
    "aliases": ["shf", "สับเปลี่ยน", "สลับ", "เปลี่ยน"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};