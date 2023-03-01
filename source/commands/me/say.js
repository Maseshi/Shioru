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
    "usage": "say (channel: name, id) <text>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "say",
            "th": "พูด"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Let the bot print instead",
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
        const inputText = interaction.options.get("text").value;
        const inputChannel = interaction.options.get("channel");

        if (!inputChannel) {
            await interaction.editReply(inputText);
            await interaction.followUp({
                "content": interaction.client.translate.commands.say.success,
                "ephemeral": true
            });
        } else {
            const channel = interaction.guild.channels.cache.find(channels => (channels.id === inputChannel.value) || (channels.name === inputChannel.value));

            await channel.send(inputText);
            await interaction.editReply({
                "content": interaction.client.translate.commands.say.success,
                "ephemeral": true
            });
        }
    }
}