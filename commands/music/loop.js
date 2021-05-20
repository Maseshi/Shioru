module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.reply(client.lang.command_music_loop_no_queue);
    
    let queueOwner = serverQueue.require.username;
    if (message.author.username !== queueOwner) return message.reply(client.lang.command_music_loop_check_not_owner);
    
    if (serverQueue.loop) {
        serverQueue.loop = !serverQueue.loop;
        serverQueue.textChannel.send(client.lang.command_music_loop_queue_loop.replace("%boolean", (serverQueue.loop ? client.lang.command_music_loop_queue_loop_true : client.lang.command_music_loop_queue_loop_false)));
    }
};

module.exports.help = {
    "name": "loop",
    "description": "Toggle music loop",
    "usage": "loop",
    "category": "music",
    "aliases": ["lp", "วน"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};