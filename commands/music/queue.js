module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.channel.send(client.lang.command_music_queue_no_queue);
    
    if (serverQueue.songs) {
        let queue = serverQueue.songs.map((song, index) => (index + 1) + ". " + song.title).join("\n");
        let embed = {
            "title": client.lang.command_music_queue_music_in_all_queue,
            "description": queue,
            "color": 4886754,
            "timestamp": serverQueue.require.timestamp,
            "footer": {
                "icon_url": serverQueue.require.avatar,
                "text": serverQueue.require.username + client.lang.command_music_queue_this_is_owner
            }
        };
        message.channel.send({ embed });
    }
    
};

module.exports.help = {
    "name": "queue",
    "description": "Check songs in the queue",
    "usage": "queue",
    "category": "music",
    "aliases": ["q", "คิว"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};