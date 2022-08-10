module.exports = {
    "name": "stop",
    "description": "Stop playing current song",
    "category": "music",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "stop",
    "aliases": ["st", "หยุด", "หยุดเล่น"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.stop.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.stop.not_owner);

        client.music.stop(message);
        message.channel.send(client.translate.commands.stop.stopped);
    }
}

module.exports.interaction = {
    "enable": true,
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