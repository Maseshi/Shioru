const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "tts",
    "description": "Text-to-Speech",
    "category": "information",
    "permissions": {
        "user": [PermissionsBitField.Flags.SendTTSMessages],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.SendTTSMessages
        ]
    },
    "usage": "tts <message(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "th": "แปลงข้อความเป็นคำพูด"
        },
        "options": [
            {
                "type": 3,
                "name": "message",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "Text to be converted to speech.",
                "description_localizations": {
                    "th": "ข้อความที่ต้องการจะแปลงเป็นคำพูด"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputMessage = interaction.options.getString("message");

        await interaction.reply({ "content": inputMessage, "tts": true });
    }
}