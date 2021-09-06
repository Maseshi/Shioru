module.exports.run = function (client, message, args) {
    let min = parseInt(args[0]);
    let max = parseInt(args[1]);

    if (min > max) {
        let temp = max;
        max = min;
        min = temp;
    }

    let result = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!result) return message.reply(client.translate.commands.numbers.empty);
    message.channel.send(client.translate.commands.numbers.result.replace("%s", result));
};

module.exports.help = {
    "name": "numbers",
    "description": "Random number specified",
    "usage": "numbers <min> <max>",
    "category": "fun",
    "aliases": ["randomNumbers", "randomnumbers", "randomNumber", "randomnumber", "number", "สุ่มเลข"],
    "permissions": "SEND_MESSAGES"
};