module.exports.run = function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.lang.command_fun_eat_no_args);
    
    let username = message.author.username;
    let mename = client.user.username;

    if (arg === mename) {
        message.reply(client.lang.command_fun_eat_me).then(function () {
            setTimeout(function () {
                return message.reply(client.lang.command_fun_eat_cannot_me);
            }, 10000);
        });
    }

    message.channel.send({
        "embed": {
            "color": 1,
            "description": username + client.lang.command_fun_eat_embed_description.replace("%euser", arg)
        }
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