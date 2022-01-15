module.exports.run = (client, message, args) => {
    const inputUsername = args.join(" ");
    
    if (!inputUsername) return message.reply(client.translate.commands.eat.empty);
    
    const authorUsername = message.author.username;
    const clientUsername = client.user.username;

    if (inputUsername === clientUsername) {
        return message.reply("...").then(() => {
            setTimeout(() => {
                message.reply(client.translate.commands.eat.do_not_eat_me);
            }, 8000);
        });
    }

    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description": client.translate.commands.eat.already_eaten.replace("%s1", authorUsername).replace("%s2", inputUsername)
            }
        ]
    });
};

module.exports.help = {
    "name": "eat",
    "description": "Fake text saying who you are eating.",
    "usage": "eat <message>",
    "category": "fun",
    "aliases": ["e", "กิน"],
    "clientPermissions": ["SEND_MESSAGES"]
};