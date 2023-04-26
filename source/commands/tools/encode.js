const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "encode",
    "description": "Encrypt your messages.",
    "category": "tools",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "encode <text(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เข้ารหัส"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "เข้ารหัสข้อความของคุณ"
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
                    "th": "ข้อความที่ต้องการจะเข้ารหัส"
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
        const encodeEmbed = new EmbedBuilder()
            .setColor(clientColor)
            .setAuthor({ "iconURL": clientAvatar, "name": clientUsername })
            .setTitle(interaction.client.translate.commands.encode.encode_message)
            .setDescription(interaction.client.translate.commands.encode.encode_success)
            .setFields(
                {
                    "name": interaction.client.translate.commands.encode.before,
                    "value": "```" + inputText + "```"
                },
                {
                    "name": interaction.client.translate.commands.encode.after,
                    "value": "```" + Buffer.from(inputText).toString("base64") + "```"
                }
            )
            .setTimestamp();

        await interaction.reply({ "embeds": [encodeEmbed], "ephemeral": true });
    }
};