module.exports.run = async function (client, message, args) {
    let frames = [
        '(-°□°)-  ┬─┬',
        '(╯°□°)╯    ]',
        '(╯°□°)╯  ︵  ┻━┻',
        '(╯°□°)╯       [',
        '(╯°□°)╯           ┬─┬'
    ];

    message.channel.send('(\\\\°□°)\\\\  ┬─┬')
    .then(function (msg) {
        for (let frame of frames) {
            setTimeout(() => {}, 1000);
            msg.edit(frame);
        }
        return;
    });
};

module.exports.help = {
    "name": "tableFlip",
    "description": "(\\\\°□°)\\\\  ┬─┬",
    "usage": "tableFlip",
    "category": "fun",
    "aliases": ["tableflip", "tf", "atf", "ฟิบโต๊ะ"]
};