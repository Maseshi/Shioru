module.exports = {
    "name": "jump",
    "description": "Skip to the selected queue number",
    "category": "music",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "jump <number>",
    "aliases": ["skipto", "ข้ามไปที่"],
    async execute(client, message, args) {
        const inputAmount = parseInt(args[0]);

        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.jump.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.jump.not_queue_owner);
        if (!inputAmount) return message.reply(client.translate.commands.jump.no_input);
        if (inputAmount <= 0) return message.reply(client.translate.commands.jump.too_low);
        if (inputAmount > queue.songs.length) return message.reply(client.translate.commands.jump.too_much);

        try {
            client.music.jump(message, inputAmount);
        } catch (error) {
            message.reply(client.translate.commands.jump.can_not_jump);
        }
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "jump",
            "th": "กระโดด"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Skip to the selected queue number",
            "th": "ข้ามไปยังหมายเลขคิวที่เลือก"
        },
        "options": [
            {
                "type": 10,
                "name": "number",
                "name_localizations": {
                    "th": "หมายเลข"
                },
                "description": "Number of songs to skip.",
                "description_localizations": {
                    "th": "หมายเลขของเพลงที่จะข้ามไป"
                },
                "required": true,
                "min_value": 1
            }
        ]
    },
    async execute(interaction) {
        const inputAmount = interaction.options.get("number").value;

        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.jump.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.jump.not_queue_owner);
        if (inputAmount > queue.songs.length) return await interaction.editReply(interaction.client.translate.commands.jump.too_much);

        try {
            interaction.client.music.jump(interaction, inputAmount);
            await interaction.editReply(interaction.client.translate.commands.jump.jumped.replace("%s", inputAmount));
        } catch (error) {
            await interaction.editReply(interaction.client.translate.commands.jump.can_not_jump);
        }
    }
}