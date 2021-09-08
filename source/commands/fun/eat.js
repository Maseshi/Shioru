module.exports.run = function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.translate.commands.eat.empty);
    
    let username = message.author.username;
    let mename = client.user.username;

    if (arg === mename) {
        return message.reply("...").then(function() {
            setTimeout(function() {
                message.reply(client.translate.commands.eat.do_not_eat_me);
            }, 8000);
        });
    }

    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description": client.translate.commands.eat.already_eaten.replace("%s1", username).replace("%s2", arg)
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
    "permissions": ["SEND_MESSAGES"]
};