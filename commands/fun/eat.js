module.exports.run = function (client, message, args) {
    let arg = args.join(" ");

    let username = message.author.username;
    let mename = client.user.username;

    if (!arg) return message.reply(client.lang.command_fun_eat_no_args);
    if (arg === mename) {
        message.channel.send(client.lang.command_fun_eat_me)
        .then(function () {
            setTimeout(function () {
                message.reply(client.lang.command_fun_eat_cannot_me);
            }, 10000);
        });
        return;
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
    "usage": "eat",
    "category": "fun",
    "aliases": ["e", "กิน"]
};