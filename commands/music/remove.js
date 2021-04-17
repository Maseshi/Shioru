const check = require("../../structures/modifyQueue");

module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_remove_no_queue);
    } else {
        if (!check(message.member)) {
            message.channel.send(client.lang.command_music_remove_check_not_owner);
        } else {
            if (!args.length && isNaN(args[0])) {
                message.reply(client.lang.command_music_remove_arg_empty);
            } else {
                let song = serverQueue.songs.splice(args[0] - 1, 1);
                serverQueue.textChannel.send(client.lang.command_music_remove_delete_success.replace("%title", (song[0].title)));
            }
        }
    }
};

module.exports.help = {
    "name": "remove",
    "description": "Remove song from the queue",
    "usage": "remove <queue number>",
    "category": "music",
    "aliases": ["rm", "rq", "ลบ", "ลบคิว"]
};