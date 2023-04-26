const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    "enable": true,
    "name": "donate",
    "description": "Donate to support bots and bot developers.",
    "category": "me",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.EmbedLinks
        ]
    },
    "usage": "donate",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "บริจาค"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "บริจาคเพื่อสนับสนุนบอทและนักพัฒนาบอท"
        }
    },
    async execute(interaction) {
        const github = "https://github.com/sponsors/Maseshi";
        const patreon = "https://www.patreon.com/maseshi";
        const bmc = "https://www.buymeacoffee.com/maseshi";
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(github)
                    .setLabel('Github')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL(patreon)
                    .setLabel('Patreon')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL(bmc)
                    .setLabel('Buy me a coffee')
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.reply({
            "content": interaction.client.translate.commands.donate.thank_you_in_advance_message,
            "components": [row]
        });
    }
};