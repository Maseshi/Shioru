const { PermissionsBitField } = require("discord.js")

module.exports = {
    "enable": true,
    "name": "say",
    "description": "Let the bot print instead",
    "category": "me",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageMessages],
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "say <text(String)> [channel]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "พูด"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ปล่อยให้บอทพิมพ์แทน"
        },
        "options": [
            {
                "type": 3,
                "name": "text",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "The message you want to send.",
                "description_localizations": {
                    "th": "ข้อความที่คุณต้องการส่ง"
                },
                "required": true
            },
            {
                "type": 7,
                "name": "channel",
                "name_localizations": {
                    "th": "ช่อง"
                },
                "description": "The channel to send the message to",
                "description_localizations": {
                    "th": "ช่องที่จะส่งข้อความ"
                },
                "required": false,
                "channel_types": [
                    0,
                    5,
                    10,
                    11,
                    12,
                    15
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputText = interaction.options.getString("text");
        const inputChannel = interaction.options.getChannel("channel") ?? "";

        if (!inputChannel) {
            await interaction.channel.send(inputText);
            await interaction.reply({ "content": interaction.client.translate.commands.say.success, "ephemeral": true});
        } else {
            await inputChannel.send(inputText);
            await interaction.reply({ "content": interaction.client.translate.commands.say.success, "ephemeral": true});
        }
    }
}