module.exports.run = function (client, message, args) {
    let username = message.author.username;
    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description":client.translate.commands.suicide.replace("%s", username)
            }
        ]
    });
};

module.exports.help = {
    "name": "dead",
    "description": "Fake message that says you commit suicide",
    "usage": "dead",
    "category": "fun",
    "aliases": ["die", "dead", "ตาย"],
    "permissions": ["SEND_MESSAGES"]
};