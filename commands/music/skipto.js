const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_skipto_no_queue);
    } else {
        if (!check(message.member)) {
            message.channel.send(client.lang.command_music_skipto_check_not_owner);
        } else {
            if (isNaN(args[0])) {
                message.reply(client.lang.command_music_skipto_aeg_empty);
            } else {
                serverQueue.playing = true;
                serverQueue.songs = serverQueue.songs.slice(args[0] - 2);
                serverQueue.connection.dispatcher.end();
                serverQueue.textChannel.send(client.lang.command_music_skipto_info.replace("%count", (args[0] - 1)));
            }
        }
    }
};

module.exports.help = {
    "name": "skipto",
    "description": "Skip to the selected queue number",
    "usage": "skipto <number>",
    "category": "music",
    "aliases": ["skt", "ข้ามไปที่"]
};