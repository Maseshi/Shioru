const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "tableFlip",
    "description": "(\\\\°□°)\\\\  ┬─┬",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "tableFlip",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "tableflip",
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

        await interaction.editReply("(\\\\°□°)\\\\  ┬─┬").then(() => {
            for (const frame of frames) {
                setTimeout(async () => {
                    await interaction.editReply(frame);
                }, 1000);
            }
        });
    }
}