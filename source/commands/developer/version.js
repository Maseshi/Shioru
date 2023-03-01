const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { version } = require('../../../package.json');

module.exports = {
    "enable": true,
    "name": "version",
    "description": "Check the current bot version.",
    "category": "developer",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "version",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "version",
            "th": "รุ่น"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Check the current bot version.",
            "th": "ตรวจสอบเวอร์ชันของบอทในปัจจุบัน!"
        }
    },
    async execute(interaction) {
        const versionEmbed = new EmbedBuilder()
            .setDescription(interaction.client.translate.commands.version.working_in_version.replace("%s", version))
            .setColor("Green");

        await interaction.editReply({
            "embeds": [versionEmbed]
        });
    }
}