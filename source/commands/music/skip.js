const { PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "skip",
    "description": "Skip the currently playing song.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "skip",
    "aliases": ["sk", "ข้าม"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.skip.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.skip.not_owner);

        client.music.skip(message);
        message.channel.send(client.translate.commands.skip.skipped);
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "skip",
            "th": "ข้าม"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Skip the currently playing song.",
            "th": "ข้ามเพลงที่กำลังเล่นอยู่"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.skip.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.skip.not_owner);

        interaction.client.music.skip(interaction);
        await interaction.editReply(interaction.client.translate.commands.skip.skipped);
    }
};