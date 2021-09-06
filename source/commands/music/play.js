const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    let search = args.join(" ");
    let channel = message.member.voice.channel;
    
    if (!search) return message.reply(client.translate.commands.play.no_song_input);
    if (!channel) return message.reply(client.translate.commands.play.not_in_channel);
    
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
    "name": "play",
    "description": "Sing to listen",
    "usage": "play <title: name, id, link>",
    "category": "music",
    "aliases": ["เล่น", "p", "เพลง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};