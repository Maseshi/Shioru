const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let volume = parseInt(args[0]);
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_volume_no_queue);
    } else {
        if (!check(message.member)) {
            message.channel.send(client.lang.command_music_volume_check_not_owner);
        } else {
            if (isNaN(volume)) {
                message.channel.send(client.lang.command_music_volume_current_level_sound.replace("%currentLevel", serverQueue.volume));
            } else {
                if (volume >= 101) {
                    message.channel.send(client.lang.command_music_volume_too_loud);
                } else {
                    if (volume <= 0) {
                        message.channel.send(client.lang.command_music_volume_too_light);
                    } else {
                        serverQueue.volume = volume;
                        serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 100);
                        message.channel.send(client.lang.command_music_volume_info.replace("%level", volume));
                    }
                }
            }
        }
    }
};

module.exports.help = {
    "name": "volume",
    "description": "Adjust the music volume",
    "usage": "volume <number>",
    "category": "music",
    "aliases": ["vl", "ระดับเสียง", "ระดับเพลง", "ปรับเสียง"]
};