module.exports.run = function (client, message, args) {
    let frames = [
        "(-°□°)-  ┬─┬",
        "(╯°□°)╯    ]",
        "(╯°□°)╯  ︵  ┻━┻",
        "(╯°□°)╯       [",
        "(╯°□°)╯           ┬─┬"
    ];

    message.channel.send("(\\\\°□°)\\\\  ┬─┬").then(function (msg) {
        for (let frame of frames) {
            setTimeout(function () {
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
    "permissions": ["SEND_MESSAGES"]
};