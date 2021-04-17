const check = require("../../structures/modifyQueue");

module.exports.run = async function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    if (!serverQueue) {
        message.channel.send(client.lang.command_music_musicInfo_no_queue);
    } else {
        if (!check(message.member)) {
            message.channel.send(client.lang.command_music_musicInfo_check_not_owner);
        } else {
            message.channel.send(client.lang.command_music_musicInfo_info.replace("%title", (serverQueue.songs[0].title)).replace("%timestamp", (serverQueue.songs[0].timestamp || client.lang.command_music_musicInfo_info_unknown)).replace("%url", (serverQueue.songs[0].url)).replace("%id", (serverQueue.songs[0].id)));
        }
    }
};

module.exports.help = {
    "name": "musicinfo",
    "description": "See information for the currently playing song",
    "usage": "musicinfo",
    "category": "music",
    "aliases": ["msinfo", "musicif", "ข้อมูลเพลง", "ข้อมูลของเพลง"]
};