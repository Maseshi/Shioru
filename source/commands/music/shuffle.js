const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "shuffle",
    "description": "Shuffle queue",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "shuffle",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "shuffle",
            "th": "สับเปลี่ยน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Shuffle queue",
            "th": "สับเปลี่ยนในคิว"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.shuffle.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.shuffle.not_owner);

        interaction.client.music.shuffle(interaction);
        await interaction.editReply(interaction.client.translate.commands.shuffle.now_shuffle);
    }
};