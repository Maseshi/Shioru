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
            "en-US": "settings",
            "th": "การตั้งค่า"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "See how to configure for each settings.",
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
            .setFooter({ "text": interaction.client.translate.commands.settings.note, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/54/information-source_2139.png" })
            .addFields(
                [
                    {
                        "name": interaction.client.translate.commands.settings.prefix,
                        "value": "```/prefix```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.languages,
                        "value": "```/lang```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.notification,
                        "value": "```/notify```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.personal,
                        "value": "```/personal```",
                        "inline": true
                    }
                ]
            );

        await interaction.editReply({ "embeds": [settingsEmbed] });
    }
};