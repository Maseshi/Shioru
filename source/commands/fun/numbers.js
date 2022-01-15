module.exports.run = (client, message, args) => {
    let inputMin = parseInt(args[0]);
    let inputMax = parseInt(args[1]);

    if (inputMin > inputMax) {
        const temp = inputMax;
        inputMax = inputMin;
        inputMin = temp;
    }

    const result = Math.floor(Math.random() * (inputMax - inputMin + 1)) + inputMin;

    if (!result) return message.reply(client.translate.commands.numbers.empty);
    
    message.channel.send(client.translate.commands.numbers.result.replace("%s", result));
};

module.exports.help = {
    "name": "numbers",
    "description": "Random number specified",
    "usage": "numbers <min> <max>",
    "category": "fun",
    "aliases": ["randomNumbers", "randomnumbers", "randomNumber", "randomnumber", "number", "สุ่มเลข"],
    "clientPermissions": ["SEND_MESSAGES"]
};