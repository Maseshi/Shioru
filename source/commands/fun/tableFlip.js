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
    "aliases": ["tableflip", "tf", "atf", "ฟิบโต๊ะ"],
    "clientPermissions": ["SEND_MESSAGES"]
};