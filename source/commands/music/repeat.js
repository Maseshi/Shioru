const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "repeat",
    "description": "Toggle repeating playback mode.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "repeat <mode>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ทำซ้ำ"
        },
        "description": module.exports.description,
        "description_localizations": {
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
                        "name": "Disable",
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
        const inputMode = interaction.options.getNumber("mode");
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.reply(interaction.client.translate.commands.repeat.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.reply(interaction.client.translate.commands.repeat.not_owner);

        const mode = interaction.client.music.setRepeatMode(interaction, inputMode);
        await interaction.reply(interaction.client.translate.commands.repeat.repeated.replace("%s", (mode ? mode == 2 ? interaction.client.translate.commands.repeat.repeat_queue : interaction.client.translate.commands.repeat.repeat_song : interaction.client.translate.commands.repeat.off)));
    }
};