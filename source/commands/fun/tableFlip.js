const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "tableflip",
    "description": "(\\\\°□°)\\\\  ┬─┬",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "tableflip",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "พลิกโต๊ะ"
        },
        "description": module.exports.description
    },
    async execute(interaction) {
        const frames = [
            "(-°□°)-  ┬─┬",
            "(╯°□°)╯    ]",
            "(╯°□°)╯  ︵  ┻━┻",
            "(╯°□°)╯       [",
            "(╯°□°)╯           ┬─┬"
        ];

        await interaction.reply("(\\\\°□°)\\\\  ┬─┬");
        
        for (const frame of frames) {
            setTimeout(async () => {
                await interaction.editReply(frame);
            }, 1000);
        }
    }
}