module.exports.run = function (client, message, args) {
    let serverQueue = message.client.data.get(message.guild.id);
    let queueOwner = serverQueue.require.username;
    
    if (!serverQueue) return message.reply(client.lang.command_music_skipto_no_queue);
    if (queueOwner !== message.author.username) return message.reply(client.lang.command_music_skipto_check_not_owner);
    if (!args[0]) return message.reply(client.lang.command_music_skipto_aeg_empty);
    
    serverQueue.playing = true;
    serverQueue.songs = serverQueue.songs.slice(args[0] - 2);
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(client.lang.command_music_skipto_info.replace("%count", (args[0] - 1)));
};

module.exports.help = {
    "name": "skipto",
    "description": "Skip to the selected queue number",
    "usage": "skipto <number>",
    "category": "music",
    "aliases": ["skt", "ข้ามไปที่"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};