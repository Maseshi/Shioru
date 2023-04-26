const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "skip",
    "description": "Skip the currently playing song.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "skip",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ข้าม"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ข้ามเพลงที่กำลังเล่นอยู่"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.reply(interaction.client.translate.commands.skip.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.reply(interaction.client.translate.commands.skip.not_owner);

        interaction.client.music.skip(interaction);
        await interaction.reply(interaction.client.translate.commands.skip.skipped);
    }
};