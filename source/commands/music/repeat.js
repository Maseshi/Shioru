module.exports = {
    "name": "repeat",
    "description": "Toggle repeating playback mode.",
    "category": "music",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "repeat <mode: 0, 1, 2>",
    "aliases": ["loop", "วน", "ทำซ้ำ"],
    async execute(client, message, args) {
        const inputMode = parseInt(args[0]);
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.repeat.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.repeat.not_owner);
        if (!inputMode) return message.reply(client.translate.commands.repeat.repeat_guide);
        if (inputMode <= 0) return message.reply(client.translate.commands.repeat.too_little);
        if (inputMode >= 2) return message.reply(client.translate.commands.repeat.too_much);

        const mode = client.music.setRepeatMode(message, inputMode);
        message.channel.send(client.translate.commands.repeat.repeated.replace("%s", (mode ? mode == 2 ? client.translate.commands.repeat.repeat_queue : client.translate.commands.repeat.repeat_song : client.translate.commands.repeat.off)));
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "repeat",
            "th": "ทำซ้ำ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Toggle repeating playback mode.",
            "th": "สลับโหมดของการเล่นเพลงซ้ำ"
        },
        "options": [
            {
                "type": 10,
                "name": "mode",
                "name_localizations": {
                    "th": "โหมด"
                },
                "description": "The mode to set the repeat to",
                "description_localizations": {
                    "th": "โหมดการตั้งค่าการทำซ้ำเป็น"
                },
                "required": true,
                "choices": [
                    {
                        "name": "Disabled",
                        "name_localizations": {
                            "th": "ปิดการใช้งาน"
                        },
                        "value": 0
                    },
                    {
                        "name": "Repeat in Song",
                        "name_localizations": {
                            "th": "ทำซ้ำในเพลง"
                        },
                        "value": 1
                    },
                    {
                        "name": "Repeat in Queue",
                        "name_localizations": {
                            "th": "ทำซ้ำในคิว"
                        },
                        "value": 2
                    }
                ],
                "min_value": 0,
                "max_value": 2
            }
        ]
    },
    async execute(interaction) {
        const inputMode = interaction.options.get("mode").value;
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.repeat.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return interaction.editReply(interaction.client.translate.commands.repeat.not_owner);

        const mode = interaction.client.music.setRepeatMode(interaction, inputMode);
        await interaction.editReply(interaction.client.translate.commands.repeat.repeated.replace("%s", (mode ? mode == 2 ? interaction.client.translate.commands.repeat.repeat_queue : interaction.client.translate.commands.repeat.repeat_song : interaction.client.translate.commands.repeat.off)));
    }
};