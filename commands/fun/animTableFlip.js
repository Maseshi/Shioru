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
            setTimeout(() => {}, 4000);
            msg.edit(frame);
        }
        return;
    });
};

module.exports.help = {
    "name": "animTableFlip",
    "description": "(\\\\°□°)\\\\  ┬─┬",
    "usage": "animTableFlip",
    "category": "fun",
    "aliases": ["animtableflip", "animtf", "atf", "ฟิบโต๊ะ"]
};