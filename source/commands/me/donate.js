const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    "name": "donate",
    "description": "Donate to support bots and bot developers.",
    "category": "me",
    "permissions": {
        "client": ["SEND_MESSAGES", "EMBED_LINKS"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "donate",
    "aliases": ["support"],
    async execute(client, message, args) {
        const patreon = "https://www.patreon.com/maseshi";
        const bmc = "https://www.buymeacoffee.com/maseshi";
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(patreon)
                    .setLabel('Patreon')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL(bmc)
                    .setLabel('Buy me a coffee')
                    .setStyle(ButtonStyle.Link)
            );

        message.channel.send({
            "content": client.translate.commands.donate.thank_you_in_advance_message,
            "components": [row]
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "donate",
            "th": "บริจาค"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Donate to support bots and bot developers.",
            "th": "บริจาคเพื่อสนับสนุนบอทและนักพัฒนาบอท"
        }
    },
    async execute(interaction) {
        const patreon = "https://www.patreon.com/maseshi";
        const bmc = "https://www.buymeacoffee.com/maseshi";
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(patreon)
                    .setLabel('Patreon')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL(bmc)
                    .setLabel('Buy me a coffee')
                    .setStyle(ButtonStyle.Link)
            );

        await interaction.editReply({
            "content": interaction.client.translate.commands.donate.thank_you_in_advance_message,
            "components": [row]
        });
    }
};