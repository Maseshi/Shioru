const { parseEmoji, PermissionsBitField } = require('discord.js');
const { parse } = require("twemoji-parser");

module.exports = {
    "name": "bigEmoji",
    "description": "Enlarge the emoji.",
    "category": "fun",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.EmbedLinks
        ]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "bigEmoji <emoji>",
    "aliases": ["enlarge", "ขยาย"],
    async execute(client, message, args) {
        const inputEmoji = args[0];
    
        if (!inputEmoji) return message.reply(client.translate.commands.bigemoji.empty_value);
    
        const custom = parseEmoji(inputEmoji);
    
        if (custom.id) {
            const baseURL = "https://cdn.discordapp.com/emojis/";
            const file = custom.id + "." + custom.animated ? "gif" : "png";
            const emojiURL = baseURL + file;
    
            return message.channel.send({ "files": [emojiURL] });
        }
    
        const parsed = parse(inputEmoji, { "assetType": "png" });
    
        if (!parsed[0]) return message.reply(client.translate.commands.bigemoji.emoji_not_found);
    
        message.channel.send({ "files": [parsed[0].url] });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "bigemoji",
            "th": "อิโมจิตัวใหญ่"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Enlarge the emoji.",
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
        const inputEmoji = interaction.options.get("emoji").value;

        const custom = parseEmoji(inputEmoji);
        
        if (custom.id) {
            const baseURL = "https://cdn.discordapp.com/emojis/";
            const file = custom.id + "." + custom.animated ? "gif" : "png";
            const emojiURL = baseURL + file;

            return await interaction.editReply({ "files": [emojiURL] });
        }

        const parsed = parse(inputEmoji, { "assetType": "png" });
        
        if (!parsed[0]) return await interaction.editReply(interaction.client.translate.commands.bigemoji.emoji_not_found);

        await interaction.editReply({ "files": [parsed[0].url] });
    }
};