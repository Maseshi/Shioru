const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_loop_no_queue);
    } else {
        if (!check(message.member)) {
            message.channel.send(client.lang.command_music_loop_check_not_owner);
        } else {
            serverQueue.loop = !serverQueue.loop;
            serverQueue.textChannel.send(client.lang.command_music_loop_queue_loop.replace("%boolean", (serverQueue.loop ? client.lang.command_music_loop_queue_loop_true : client.lang.command_music_loop_queue_loop_false)));
        }
    }
};

module.exports.help = {
    "name": "loop",
    "description": "Toggle music loop",
    "usage": "loop",
    "category": "music",
    "aliases": ["lp", "วน"]
};