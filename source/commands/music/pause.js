module.exports = {
    "name": "pause",
    "description": "Temporarily stop playing songs in the queue.",
    "category": "music",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "pause",
    "aliases": ["pu", "หยุดชั่วคราว"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.pause.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.pause.not_owner);
        if (queue.paused) return message.reply(client.translate.commands.pause.not_paused);

        client.music.pause(message);
        message.channel.send(client.translate.commands.pause.paused);
    }
}

module.exports.interaction = {
    "enable": true,
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