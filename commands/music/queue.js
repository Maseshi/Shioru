module.exports.run = function (client, message, args) {
    if (client.music.isPaused(message) || client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);
        let queueList = queue.songs.map((song, id) => (id + 1) + ". " + song.name).slice(0, 10).join("\n");
        let queueCreatedTimestamp = queue.initMessage.createdTimestamp;
        let queueAuthorUid = queue.initMessage.author.id;
        let queueAuthorUsername = queue.initMessage.author.username;
        let queueAuthorAvatar = queue.initMessage.author.avatar;
        let avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";
    
        message.channel.send({
            "embed": {
                "title": client.data.language.command_music_queue_music_in_all_queue,
                "description": queueList,
                "color": 4886754,
                "timestamp": queueCreatedTimestamp,
                "footer": {
                    "icon_url": avatarURL,
                    "text": queueAuthorUsername + client.data.language.command_music_queue_this_is_owner
                }
            }
        });
    } else {
        message.reply(client.data.language.command_music_queue_no_queue);
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