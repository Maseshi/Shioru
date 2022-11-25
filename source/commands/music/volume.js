const { PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "volume",
    "description": "Adjust the music volume",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "volume [percent]",
    "aliases": ["vl", "ระดับเสียง", "ระดับเพลง", "ปรับเสียง"],
    async execute(client, message, args) {
        const inputPercent = parseInt(args[0]);
        const queue = client.music.getQueue(message);
    
        if (!queue) return message.reply(client.translate.commands.volume.no_queue);
    
        const queueVolume = queue.volume;
    
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.volume.not_owner);
        if (!inputPercent) return message.reply(client.translate.commands.volume.this_volume.replace("%s", queueVolume));
        if (inputPercent < 0) return message.reply(client.translate.commands.volume.too_little);
        if (inputPercent > 100) return message.reply(client.translate.commands.volume.too_much);
    
        client.music.setVolume(message, inputPercent);
        message.channel.send(client.translate.commands.volume.adjusted.replace("%s", inputPercent));
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "volume",
            "th": "ระดับเสียง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Adjust the music volume",
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
        const inputPercent = interaction.options.get("percent");
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.volume.no_queue);

        const queueVolume = queue.volume;

        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.volume.not_owner);
        if (!inputPercent) return await interaction.editReply(interaction.client.translate.commands.volume.this_volume.replace("%s", queueVolume));

        interaction.client.music.setVolume(interaction, inputPercent.value);
        await interaction.editReply(interaction.client.translate.commands.volume.adjusted.replace("%s", inputPercent.value));
    }
};