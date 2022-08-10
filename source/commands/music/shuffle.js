module.exports = {
    "name": "shuffle",
    "description": "Shuffle queue",
    "category": "music",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "shuffle",
    "aliases": ["shf", "สับเปลี่ยน", "สลับ", "เปลี่ยน"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.shuffle.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.shuffle.not_owner);

        client.music.shuffle(message);
        message.channel.send(client.translate.commands.shuffle.now_shuffle);
    }
}

module.exports.interaction = {
    "enable": true,
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