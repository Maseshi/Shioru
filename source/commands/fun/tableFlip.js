const { PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "tableFlip",
    "description": "(\\\\°□°)\\\\  ┬─┬",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "tableFlip",
    "aliases": ["tableflip", "tf", "ฟิบโต๊ะ"],
    async execute(client, message, args) {
        const frames = [
            "(-°□°)-  ┬─┬",
            "(╯°□°)╯    ]",
            "(╯°□°)╯  ︵  ┻━┻",
            "(╯°□°)╯       [",
            "(╯°□°)╯           ┬─┬"
        ];
    
        message.channel.send("(\\\\°□°)\\\\  ┬─┬").then((msg) => {
            for (const frame of frames) {
                setTimeout(() => {
                    msg.edit(frame);
                }, 1000);
            }
        });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
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
};