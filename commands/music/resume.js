const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_resume_no_queue);
    } else {
        if (!serverQueue.playing) {
            if (!check(message.member)) {
                message.channel.send(client.lang.command_music_resume_check_not_owner);
            } else {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                message.channel.send(client.lang.command_music_resume_info);
            }
        } else {
            message.channel.send(client.lang.command_music_resume_now_playing);
        }
    }
};

module.exports.help = {
    "name": "resume",
    "description": "resume playing the current song",
    "usage": "resume",
    "category": "music",
    "aliases": ["rs", "เล่นต่อ", "ต่อ"]
};