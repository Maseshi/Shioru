const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "resume",
    "description": "Continue playing music from the beginning.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "resume",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เล่นต่อ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "เล่นเพลงต่อจากจุดเริ่มต้น"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.reply(interaction.client.translate.commands.resume.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.reply(interaction.client.translate.commands.resume.not_owner);
        if (!queue.paused) return await interaction.reply(interaction.client.translate.commands.resume.now_playing);

        interaction.client.music.resume(interaction);
        await interaction.reply(interaction.client.translate.commands.resume.resumed);
    }
};