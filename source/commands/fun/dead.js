const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "dead",
    "description": "Fake message that says you commit suicide.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "dead",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เสียชีวิต"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ข้อความปลอมที่บอกว่าคุณฆ่าตัวตาย!"
        }
    },
    async execute(interaction) {
        const authorUsername = interaction.user.username;
        const deadEmbed = new EmbedBuilder()
            .setDescription(interaction.client.translate.commands.dead.suicide.replace("%s", authorUsername))
            .setColor("Default");

        await interaction.reply({ "embeds": [deadEmbed] });
    }
}