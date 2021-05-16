module.exports.run = async function (client, message, args) {
    let min = parseInt(args[0]);
    let max = parseInt(args[1]);

    if (min > max) {
        let temp = max;
        max = min;
        min = temp;
    }

    let result = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!result) return message.reply(client.lang.command_messages_numbers_arg_empty);
    message.channel.send(client.lang.command_messages_numbers_result + result);
};

module.exports.help = {
    "name": "numbers",
    "description": "Random number specified",
    "usage": "numbers <min> <max>",
    "category": "messages",
    "aliases": ["randomNumbers", "randomnumbers", "randomNumber", "randomnumber", "number", "สุ่มเลข"],
    "permissions": "SEND_MESSAGES"
};