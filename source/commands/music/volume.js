const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "volume",
    "description": "Adjust the music volume",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "volume [percent(Number)]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ระดับเสียง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ปรับระดับเสียงเพลง"
        },
        "options": [
            {
                "type": 10,
                "name": "percent",
                "name_localizations": {
                    "th": "เปอร์เซ็นต์"
                },
                "description": "Adjust the volume of the music from 0 to 100.",
                "description_localizations": {
                    "th": "ปรับระดับเสียงของเพลงจาก 0 ถึง 100"
                },
                "required": false,
                "min_value": 0,
                "max_value": 100
            }
        ]
    },
    async execute(interaction) {
        const inputPercent = interaction.options.getNumber("percent") ?? "";
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.reply(interaction.client.translate.commands.volume.no_queue);

        const queueVolume = queue.volume;

        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.reply(interaction.client.translate.commands.volume.not_owner);
        if (!inputPercent) return await interaction.reply(interaction.client.translate.commands.volume.this_volume.replace("%s", queueVolume));

        interaction.client.music.setVolume(interaction, inputPercent);
        await interaction.reply(interaction.client.translate.commands.volume.adjusted.replace("%s", inputPercent));
    }
};