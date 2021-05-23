module.exports.run = function (client, message, args) {
    let channel = message.member.voice.channel;
    let search = args.join(" ");
    
    if (!channel) return message.reply(client.data.language.command_music_play_user_not_in_channel);
    if (!search) return message.reply(client.data.language.command_music_play_arg_empty);

    channel.join().then(function () {
        client.music.play(message, search);
    }).catch(function (error) {
        console.log(error);
        channel.leave().then(function () {
            message.reply(client.data.language.command_music_play_cant_join_channel + error);
        });
    });
};

module.exports.help = {
    "name": "play",
    "description": "Sing to listen",
    "usage": "play <title: name, id, link>",
    "category": "music",
    "aliases": ["เล่น", "p", "เพลง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};