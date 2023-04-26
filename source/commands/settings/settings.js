const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "settings",
    "description": "See how to configure for each settings.",
    "category": "settings",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "settings",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "การตั้งค่า"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ดูวิธีการกำหนดค่าสำหรับแต่ละการตั้งค่า"
        }
    },
    async execute(interaction) {
        const clientFetch = await interaction.client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const settingsEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.settings.title)
            .setDescription(interaction.client.translate.commands.settings.description)
            .setColor(clientColor)
            .setFooter({ "text": interaction.client.translate.commands.settings.note })
            .addFields(
                [
                    {
                        "name": interaction.client.translate.commands.settings.command,
                        "value": "```/help set-command```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.languages,
                        "value": "```/help set-language```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.notification,
                        "value": "```/help set-notify```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.personal,
                        "value": "```/help set-personal```",
                        "inline": true
                    }
                ]
            );

        await interaction.reply({ "embeds": [settingsEmbed] });
    }
};