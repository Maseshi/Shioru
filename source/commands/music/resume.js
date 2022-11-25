const { PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "resume",
    "description": "Continue playing music from the beginning.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "resume",
    "aliases": ["rs", "เล่นต่อ", "ต่อ"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.resume.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.resume.not_owner);
        if (!queue.paused) return message.reply(client.translate.commands.resume.now_playing);

        client.music.resume(message);
        message.channel.send(client.translate.commands.resume.resumed);
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "resume",
            "th": "เล่นต่อ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Continue playing music from the beginning.",
            "th": "เล่นเพลงต่อจากจุดเริ่มต้น"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.resume.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.resume.not_owner);
        if (!queue.paused) return await interaction.editReply(interaction.client.translate.commands.resume.now_playing);

        interaction.client.music.resume(interaction);
        await interaction.editReply(interaction.client.translate.commands.resume.resumed);
    }
};