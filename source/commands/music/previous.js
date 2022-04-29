module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.previous.no_queue);
    if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.previous.not_owner);
    if (!queue.previousSongs) return message.reply(client.translate.commands.previous.no_previous_song_queue);

    client.music.previous(message);
    message.channel.send(client.translate.commands.previous.previous);
};

module.exports.help = {
    "name": "previous",
    "description": "Return to the previous song.",
    "usage": "previous",
    "category": "music",
    "aliases": ["pv", "เพลงก่อนหน้า"],
    "clientPermissions": ["SEND_MESSAGES", "CONNECT"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "previous",
            "th": "ก่อนหน้า"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Return to the previous song.",
            "th": "กลับไปยังเพลงก่อนหน้านี้"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.previous.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.previous.not_owner);
        if (!queue.previousSongs) return await interaction.editReply(interaction.client.translate.commands.previous.no_previous_song_queue);

        interaction.client.music.previous(interaction);
        await interaction.editReply(interaction.client.translate.commands.previous.previous);
    }
};