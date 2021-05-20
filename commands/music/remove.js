module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) return message.reply(client.lang.command_music_remove_no_queue);

    let queueOwner = serverQueue.require.username;
    if (queueOwner !== message.author.username) return message.reply(client.lang.command_music_remove_check_not_owner);

    if (!args.length && !args[0]) return message.reply(client.lang.command_music_remove_arg_empty);
    let song = serverQueue.songs.splice(args[0] - 1, 1);
    serverQueue.textChannel.send(client.lang.command_music_remove_delete_success.replace("%title", (song[0].title)));
};

module.exports.help = {
    "name": "remove",
    "description": "Remove song from the queue",
    "usage": "remove <number>",
    "category": "music",
    "aliases": ["rm", "rq", "ลบ", "ลบคิว"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};