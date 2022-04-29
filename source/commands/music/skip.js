module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.skip.no_queue);
    if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.skip.not_owner);

    client.music.skip(message);
    message.channel.send(client.translate.commands.skip.skipped);
};

module.exports.help = {
    "name": "skip",
    "description": "Skip the currently playing song.",
    "usage": "skip",
    "category": "music",
    "aliases": ["sk", "ข้าม"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "skip",
            "th": "ข้าม"
        },
        "description": module.exports.help.description,
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