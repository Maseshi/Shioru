module.exports.run = (client, message, args) => {
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
};

module.exports.help = {
    "name": "tableFlip",
    "description": "(\\\\°□°)\\\\  ┬─┬",
    "usage": "tableFlip",
    "category": "fun",
    "aliases": ["tableflip", "tf", "ฟิบโต๊ะ"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name.toLowerCase(),
        "name_localizations": {
            "en-US": "tableflip",
            "th": "พลิกโต๊ะ"
        },
        "description": module.exports.help.description
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