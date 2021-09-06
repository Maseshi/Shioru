const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    if (!client.music.options.searchSongs) {
        client.music.options.searchSongs = true;
        return module.exports.run(client, message, args);
    }

    let search = args.join(" ");
    let channel = message.member.voice.channel;

    if (!search) return message.reply(client.translate.commands.search.no_search_input);
    if (!channel) return message.reply(client.translate.commands.search.user_not_in_channel);

    try {
        joinVoiceChannel({
            "channelId": channel.id,
            "guildId": message.guild.id,
            "adapterCreator": message.guild.voiceAdapterCreator
        });
        client.music.play(message, search);
    } catch (err) {
        let connection = getVoiceConnection(channel.guild.id);
		
        connection.destroy();
        catchError(client, message, module.exports.help.name, err);
    }
};

module.exports.help = {
    "name": "search",
    "description": "Search and select videos to play",
    "usage": "search <song>",
    "category": "music",
    "aliases": ["ค้นหา", "sch"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};