const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_skip_no_queue);
    } else {
        if (!check(message.member)) {
            message.channel.send(client.lang.command_music_skip_check_not_owner);
        } else {
            serverQueue.connection.dispatcher.end();
            message.channel.send(client.lang.command_music_skip_info);
        }
    }
};

module.exports.help = {
    "name": "skip",
    "description": "Skip songs being played",
    "usage": "skip",
    "category": "music",
    "aliases": ["sk", "ข้าม"]
};