const { PermissionsBitField } = require("discord.js")

module.exports = {
    "enable": true,
    "name": "pause",
    "description": "Temporarily stop playing songs in the queue.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "pause",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "pause",
            "th": "หยุดชั่วคราว"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Temporarily stop playing songs in the queue.",
            "th": "หยุดเล่นเพลงในคิวชั่วคราว"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.pause.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.pause.not_owner);
        if (queue.paused) return await interaction.editReply(interaction.client.translate.commands.pause.not_paused);

        interaction.client.music.pause(interaction);
        await interaction.editReply(interaction.client.translate.commands.pause.paused);
    }
}