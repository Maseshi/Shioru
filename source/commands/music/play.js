const { PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "play",
    "description": "You can play-pause the music or sing along to it.",
    "category": "music",
    "permissions": {
        "user": [PermissionsBitField.Flags.Connect],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.Speak,
            PermissionsBitField.Flags.Connect
        ]
    },
    "usage": "play [source(String)]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เล่น"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "เล่น-หยุดเพลงก็ได้หรือร้องเพลงให้ฟัง"
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
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputSource = interaction.options.getString("source") ?? "";

        if (inputSource) {
            const voiceChannel = interaction.member.voice.channel;

            if (!voiceChannel) return await interaction.reply(interaction.client.translate.commands.play.not_in_channel);

            try {
                await interaction.deferReply();
                await interaction.client.music.play(voiceChannel, inputSource, {
                    "member": interaction.member,
                    "textChannel": interaction.channel,
                    interaction
                });
                await interaction.deleteReply();
            } catch (error) {
                const connection = interaction.client.music.voices.get(voiceChannel.guild);

                if (connection) connection.leave(voiceChannel.guild);
                catchError(interaction.client, interaction, module.exports.name, error);
            }
        } else {
            const queue = interaction.client.music.getQueue(interaction);

            if (!queue) return await interaction.reply(interaction.client.translate.commands.play.no_queue);
            if (queue.paused) {
                interaction.client.commands.get("resume").function.command.execute(interaction);
            } else {
                interaction.client.commands.get("pause").function.command.execute(interaction);
            }
        }
    }
};