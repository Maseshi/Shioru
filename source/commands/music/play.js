const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    const inputSource = args.join(" ");
    const voiceChannel = message.member.voice.channel;

    if (!inputSource) return message.reply(client.translate.commands.play.no_song_input);
    if (!voiceChannel) return message.reply(client.translate.commands.play.not_in_channel);

    try {
        client.music.play(voiceChannel, inputSource, {
            "member": message.member,
            "textChannel": message.channel,
            message
        });
    } catch (error) {
        const connection = client.music.voices.get(voiceChannel.guild);

        connection.leave(voiceChannel.guild);
        catchError(client, message, module.exports.help.name, error);
    }
};

module.exports.help = {
    "name": "play",
    "description": "Sing to listen",
    "usage": "play <source: name, id, link>",
    "category": "music",
    "aliases": ["เล่น", "p", "เพลง"],
    "userPermissions": ["CONNECT"],
    "clientPermissions": ["SEND_MESSAGES", "SPEAK", "CONNECT"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "play",
            "th": "เล่น"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Sing to listen",
            "th": "ร้องเพลงให้ฟัง"
        },
        "options": [
            {
                "type": 3,
                "name": "source",
                "name_localizations": {
                    "th": "ที่มา"
                },
                "description": "You can search for songs by name, ID or link.",
                "description_localizations": {
                    "th": "คุณสามารถค้นหาเพลงตามชื่อ ID หรือลิงค์"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputSource = interaction.options.get("source").value;
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) return await interaction.editReply(interaction.client.translate.commands.play.not_in_channel);

        try {
            await interaction.client.music.play(voiceChannel, inputSource, {
                "member": interaction.member,
                "textChannel": interaction.channel,
                interaction
            });
            await interaction.deleteReply();
        } catch (error) {
            const connection = interaction.client.music.voices.get(voiceChannel.guild);

            connection.leave(voiceChannel.guild);
            catchError(interaction.client, interaction, module.exports.help.name, error);
        }
    }
};