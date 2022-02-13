const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    const inputName = args.join(" ");
    const voiceChannel = message.member.voice.channel;
    
    if (!inputName) return message.reply(client.translate.commands.play.no_song_input);
    if (!voiceChannel) return message.reply(client.translate.commands.play.not_in_channel);
    
    try {
        joinVoiceChannel({
            "channelId": voiceChannel.id,
            "guildId": message.guild.id,
            "adapterCreator": message.guild.voiceAdapterCreator
        });
        client.music.play(voiceChannel, inputName, {
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
    "name": "play",
    "description": "Sing to listen",
    "usage": "play <title: name, id, link>",
    "category": "music",
    "aliases": ["เล่น", "p", "เพลง"],
    "clientPermissions": ["SEND_MESSAGES", "SPEAK", "CONNECT"]
};