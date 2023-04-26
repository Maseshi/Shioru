const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { join } = require("node:path");
const { readFileSync } = require("node:fs");

module.exports = {
    "enable": true,
    "name": "license",
    "description": "Understanding copyrighted material",
    "category": "me",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "license",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ลายเซ็น"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ทำความเข้าใจกับเนื้อหาที่มีลิขสิทธิ์"
        }
    },
    async execute(interaction) {
        const licensePath = join(__dirname, "../../../");
        const license = readFileSync(licensePath + "/LICENSE", "utf8");

        const clientFetch = await interaction.client.user.fetch();
        const clientAvatar = interaction.client.user.avatarURL();
        const clientUsername = interaction.client.user.username;
        const clientColor = clientFetch.accentColor;
        const licenseEmbed = new EmbedBuilder()
            .setColor(clientColor)
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar, "url": "https://shiorus.web.app/" })
            .setTitle(interaction.client.translate.commands.license.copyright_content)
            .setDescription("```" + license + "```")
            .setTimestamp();

        await interaction.reply({ "embeds": [licenseEmbed] });
    }
};