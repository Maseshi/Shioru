const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "decode",
    "description": "Decrypt your messages.",
    "category": "tools",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "decode <text(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ถอดรหัส"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ถอดรหัสข้อความของคุณ"
        },
        "options": [
            {
                "type": 3,
                "name": "text",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "Message to be decrypted.",
                "description_localizations": {
                    "th": "ข้อความที่ต้องการจะถอดรหัส"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputText = interaction.options.getString("text");

        const clientAvatar = interaction.client.user.displayAvatarURL();
        const clientUsername = interaction.client.user.username;
        const clientColor = interaction.guild.members.me.displayHexColor;
        const decodeEmbed = new EmbedBuilder()
            .setColor(clientColor)
            .setAuthor({ "iconURL": clientAvatar, "name": clientUsername })
            .setTitle(interaction.client.translate.commands.decode.decode_message)
            .setDescription(interaction.client.translate.commands.decode.decode_success)
            .setFields(
                {
                    "name": interaction.client.translate.commands.decode.before,
                    "value": "```" + inputText + "```"
                },
                {
                    "name": interaction.client.translate.commands.decode.after,
                    "value": "```" + Buffer.from(inputText, "base64").toString() + "```"
                }
            )
            .setTimestamp();

        await interaction.reply({ "embeds": [decodeEmbed], "ephemeral": true });
    }
};