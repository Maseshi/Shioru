const { parseEmoji, PermissionsBitField } = require('discord.js');

module.exports = {
    "enable": true,
    "name": "enlarge",
    "description": "Enlarge the emoji.",
    "category": "tools",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.EmbedLinks
        ]
    },
    "usage": "enlarge <emoji(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "อิโมจิตัวใหญ่"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ขยายอิโมจิให้ใหญ่ขึ้น"
        },
        "options": [
            {
                "type": 3,
                "name": "emoji",
                "name_localizations": {
                    "th": "อีโมจิ"
                },
                "description": "The emoji you want to be enlarged",
                "description_localizations": {
                    "th": "อีโมจิที่ต้องการให้ขยายให้ใหญ่ขึ้น"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputEmoji = interaction.options.getString("emoji");

        const parsedEmoji = parseEmoji(inputEmoji);

        if (inputEmoji.startsWith("<") && inputEmoji.endsWith(">")) {
            const fileType = inputEmoji.id + "." + inputEmoji.animated ? "gif" : "png";
            const emojiURL = "https://cdn.discordapp.com/emojis/" + parsedEmoji.id + fileType;

            await interaction.reply({ "files": [emojiURL] });
        } else {
            await interaction.reply(interaction.client.translate.commands.enlarge.emoji_not_found);
        }
    }
}