const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "remove",
    "description": "Remove song from the queue",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "remove <number(Number)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ลบ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ลบเพลงออกจากคิว"
        },
        "options": [
            {
                "type": 10,
                "name": "number",
                "name_localizations": {
                    "th": "หมายเลข"
                },
                "description": "The number of songs to be deleted.",
                "description_localizations": {
                    "th": "หมายเลขของเพลงที่ต้องการจะลบ"
                },
                "required": true,
                "min_value": 1
            }
        ]
    },
    async execute(interaction) {
        const inputAmount = interaction.options.getNumber("number");
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.reply(interaction.client.translate.commands.remove.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.reply(interaction.client.translate.commands.remove.not_owner);
        if (inputAmount >= queue.songs.length) return await interaction.reply(interaction.client.translate.commands.remove.too_much);

        const song = queue.songs.splice(inputAmount, 1);
        await interaction.reply(interaction.client.translate.commands.remove.removed.replace("%s", song[0].name));
    }
};