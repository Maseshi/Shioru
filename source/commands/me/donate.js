const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.run = (client, message, args) => {
    const patreon = "https://www.patreon.com/maseshi";
    const bmc = "https://www.buymeacoffee.com/maseshi";

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setURL(patreon)
                .setLabel('Patreon')
                .setStyle('LINK'),
            new MessageButton()
                .setURL(bmc)
                .setLabel('Buy me a coffee')
                .setStyle('LINK')
        );

    message.channel.send({
        "content": client.translate.commands.donate.thank_you_in_advance_message,
        "components": [row]
    });
}

module.exports.help = {
    "name": "donate",
    "description": "Donate to support bots and bot developers.",
    "usage": "donate",
    "category": "me",
    "aliases": ["support"],
    "clientPermissions": ["SEND_MESSAGES", "EMBED_LINKS"]
}

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "donate",
            "th": "บริจาค"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Donate to support bots and bot developers.",
            "th": "บริจาคเพื่อสนับสนุนบอทและนักพัฒนาบอท"
        }
    },
    async execute(interaction) {
        const patreon = "https://www.patreon.com/maseshi";
        const bmc = "https://www.buymeacoffee.com/maseshi";

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL(patreon)
                    .setLabel('Patreon')
                    .setStyle('LINK'),
                new MessageButton()
                    .setURL(bmc)
                    .setLabel('Buy me a coffee')
                    .setStyle('LINK')
            );

        await interaction.editReply({
            "content": interaction.client.translate.commands.donate.thank_you_in_advance_message,
            "components": [row]
        });
    }
};