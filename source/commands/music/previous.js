const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "previous",
    "description": "Return to the previous song.",
    "category": "music",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.Connect
        ]
    },
    "usage": "previous",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "previous",
            "th": "ก่อนหน้า"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Return to the previous song.",
            "th": "กลับไปยังเพลงก่อนหน้านี้"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.previous.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.previous.not_owner);
        if (!queue.previousSongs) return await interaction.editReply(interaction.client.translate.commands.previous.no_previous_song_queue);

        interaction.client.music.previous(interaction);
        await interaction.editReply(interaction.client.translate.commands.previous.previous);
    }
};