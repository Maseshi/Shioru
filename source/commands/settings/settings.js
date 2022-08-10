const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "settings",
    "description": "See how to configure for each settings.",
    "category": "settings",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "settings",
    "aliases": ["config", "cf", "set", "ตั้งค่า", "การตั้งค่า"],
    async execute(client, message, args) {
        const prefix = client.config.prefix;
        const clientFetch = await client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const settingsEmbed = new EmbedBuilder()
            .setTitle(client.translate.commands.settings.title)
            .setDescription(client.translate.commands.settings.description)
            .setColor(clientColor)
            .setFooter({ "text": client.translate.commands.settings.note, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/54/information-source_2139.png" })
            .addFields(
                [
                    {
                        "name": client.translate.commands.settings.prefix,
                        "value": "```" + prefix + "prefix```\n```/prefix```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.settings.languages,
                        "value": "```" + prefix + "lang```\n```/lang```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.settings.notification,
                        "value": "```" + prefix + "notify```\n```/notify```",
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.settings.personal,
                        "value": "```" + prefix + "personal```\n```/personal```",
                        "inline": true
                    }
                ]
            );
    
        message.channel.send({ "embeds": [settingsEmbed] });
    }
}

module.exports.interaction = {
    "enable": true,
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
        const prefix = interaction.client.config.prefix;
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
                        "value": "```" + prefix + "prefix```\n```/prefix```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.languages,
                        "value": "```" + prefix + "lang```\n```/lang```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.notification,
                        "value": "```" + prefix + "notify```\n```/notify```",
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.settings.personal,
                        "value": "```" + prefix + "personal```\n```/personal```",
                        "inline": true
                    }
                ]
            );

        await interaction.editReply({ "embeds": [settingsEmbed] });
    }
};