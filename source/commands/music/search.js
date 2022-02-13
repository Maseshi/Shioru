const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    if (!client.music.options.searchSongs) {
        client.music.options.searchSongs = true;
        return module.exports.run(client, message, args);
    }

    const inputSearch = args.join(" ");
    const voiceChannel = message.member.voice.channel;

    if (!inputSearch) return message.reply(client.translate.commands.search.no_search_input);
    if (!voiceChannel) return message.reply(client.translate.commands.search.user_not_in_channel);

    try {
        joinVoiceChannel({
            "channelId": voiceChannel.id,
            "guildId": message.guild.id,
            "adapterCreator": message.guild.voiceAdapterCreator
        });
        client.music.play(voiceChannel, inputSearch, {
            "member": message.member,
            "textChannel": message.channel,
            message
        });
    } catch (error) {
        const connection = getVoiceConnection(voiceChannel.guild.id);
		
        connection.destroy();
        catchError(client, message, module.exports.help.name, error);
    }
};

module.exports.help = {
    "name": "search",
    "description": "Search and select videos to play",
    "usage": "search <song>",
    "category": "music",
    "aliases": ["ค้นหา", "sch"],
    "clientPermissions": ["SEND_MESSAGES"]
};