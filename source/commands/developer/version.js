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
            "th": "รุ่น"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตรวจสอบเวอร์ชันของบอทในปัจจุบัน!"
        }
    },
    async execute(interaction) {
        const clientAvatar = interaction.client.user.displayAvatarURL();
        const clientUsername = interaction.client.user.username;
        const clientColor = interaction.guild.members.me.displayHexColor;
        const versionEmbed = new EmbedBuilder()
            .setColor(clientColor)
            .setAuthor({ "iconURL": clientAvatar, "name": clientUsername })
            .setDescription(interaction.client.translate.commands.version.working_in_version.replace("%s", version));

        await interaction.reply({ "embeds": [versionEmbed] });
    }
}