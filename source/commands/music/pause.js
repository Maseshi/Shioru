module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.pause.no_queue);
    if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.pause.not_owner);
    if (queue.paused) return message.reply(client.translate.commands.pause.not_paused);

    client.music.pause(message);
    message.channel.send(client.translate.commands.pause.paused);
};

module.exports.help = {
    "name": "pause",
    "description": "Temporarily stop playing songs in the queue.",
    "usage": "pause",
    "category": "music",
    "aliases": ["pu", "หยุดชั่วคราว"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "pause",
            "th": "หยุดชั่วคราว"
        },
        "description": module.exports.help.description,
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