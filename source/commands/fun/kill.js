module.exports.run = function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.translate.commands.kill.empty);

    let username = message.author.username;
    let mename = client.user.username;

    if (arg === mename) return message.reply(client.translate.commands.kill.do_not_kill_me);

    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description": client.translate.commands.kill.killed.replace("%s1", username).replace("%s2", arg)
            }
        ]
    });
};

module.exports.help = {
    "name": "kill",
    "description": "Fake messages saying you killed someone.",
    "usage": "kill <message>",
    "category": "fun",
    "aliases": ["KDA", "kda", "ฆ่า"],
    "permissions": ["SEND_MESSAGES"]
};