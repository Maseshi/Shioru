module.exports.run = (client, message, args) => {
    const inputUsername = args.join(" ");
    
    if (!inputUsername) return message.reply(client.translate.commands.kill.empty);

    const authorUsername = message.author.username;
    const clientUsername = client.user.username;

    if (inputUsername === clientUsername) return message.reply(client.translate.commands.kill.do_not_kill_me);

    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description": client.translate.commands.kill.killed.replace("%s1", authorUsername).replace("%s2", inputUsername)
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
    "clientPermissions": ["SEND_MESSAGES"]
};