const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "dead",
    "description": "Fake message that says you commit suicide.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "dead",
    "aliases": ["die", "dead", "ตาย", "เสียชีวิต"],
    async execute(client, message, args) {
        const authorUsername = message.author.username;
        const deadEmbed = new EmbedBuilder()
            .setDescription(client.translate.commands.dead.suicide.replace("%s", authorUsername))
            .setColor("Default");

        message.channel.send({
            "embeds": [deadEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "dead",
            "th": "เสียชีวิต"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Fake message that says you commit suicide.",
            "th": "ข้อความปลอมที่บอกว่าคุณฆ่าตัวตาย!"
        }
    },
    async execute(interaction) {
        const authorUsername = interaction.user.username;
        const deadEmbed = new EmbedBuilder()
            .setDescription(interaction.client.translate.commands.dead.suicide.replace("%s", authorUsername))
            .setColor("Default");

        await interaction.editReply({
            "embeds": [deadEmbed]
        });
    }
};