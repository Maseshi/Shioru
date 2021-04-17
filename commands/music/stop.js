const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_stop_no_queue);
    } else {
        if (!check(message.member)) {
            message.channel.send(client.lang.command_music_stop_check_not_owner);
        } else {
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            message.channel.send(client.lang.command_music_stop_info);
        }
    }
};

module.exports.help = {
    "name": "stop",
    "description": "Stop playing current song",
    "usage": "stop",
    "category": "music",
    "aliases": ["st", "หยุด", "หยุดเล่น"]
};