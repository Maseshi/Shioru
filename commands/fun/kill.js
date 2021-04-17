module.exports.run = function (client, message, args) {
    let arg = args.join(" ");

    let username = message.author.username;
    let mename = client.user.username;

    if (!arg) return message.reply(client.lang.command_fun_kill_no_args);
    if (arg === mename) return message.reply(client.lang.command_fun_kill_me);
    message.channel.send({
        "embed": {
            "color": 1,
            "description": username + client.lang.command_fun_kill_embed_description.replace("%duser", arg)
        }
    });
};

module.exports.help = {
    "name": "kill",
    "description": "Fake messages saying you killed someone.",
    "usage": "kill",
    "category": "fun",
    "aliases": ["KDA", "kda", "ฆ่า"]
};