const { PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "play",
    "description": "Sing to listen",
    "category": "music",
    "permissions": {
        "user": [PermissionsBitField.Flags.Connect],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.Speak,
            PermissionsBitField.Flags.Connect
        ]
    },
    "usage": "play <source: name, id, link>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "play",
            "th": "เล่น"
        },
        "description": module.exports.description,
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
            catchError(interaction.client, interaction, module.exports.name, error);
        }
    }
};