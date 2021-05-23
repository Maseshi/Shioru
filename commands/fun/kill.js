module.exports.run = function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.data.language.command_fun_kill_no_args);

    let username = message.author.username;
    let mename = client.user.username;

    if (arg === mename) return message.reply(client.data.language.command_fun_kill_me);

    message.channel.send({
        "embed": {
            "color": 1,
            "description": username + client.data.language.command_fun_kill_embed_description.replace("%duser", arg)
        }
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