const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "qrcode",
    "description": "Generate your QR code.",
    "category": "tools",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "qrcode <text(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "คิวอาร์โค้ด"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "สร้างคิวอาร์โค้ดของคุณ"
        },
        "options": [
            {
                "type": 3,
                "name": "text",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "Message to be encrypted.",
                "description_localizations": {
                    "th": "ข้อความหรือลิงค์ที่ต้องการจะสร้างคิวอาร์โค้ด"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputText = interaction.options.getString("text");

        const apiURL = "https://api.qrserver.com/v1";
        const createQRCode = "/create-qr-code/?size=1024x1024&data=";
        const data = apiURL + createQRCode + inputText.replace(new RegExp(" ", "g"), "%20")

        const qrcodeEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle(interaction.client.translate.commands.qrcode.qrcode_title)
            .setDescription(interaction.client.translate.commands.qrcode.qrcode_success)
            .setImage(data)
            .setTimestamp();

        await interaction.reply({ "embeds": [qrcodeEmbed] });
    }
};