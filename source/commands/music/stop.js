const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "stop",
    "description": "Stop playing current song",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "stop",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "stop",
            "th": "หยุด"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Stop playing current song",
            "th": "หยุดเล่นเพลงปัจจุบัน"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.stop.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.stop.not_owner);

        interaction.client.music.stop(interaction);
        await interaction.editReply(interaction.client.translate.commands.stop.stopped);
    }
};