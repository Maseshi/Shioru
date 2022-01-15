module.exports.run = (client, message, args) => {
    const authorUsername = message.author.username;
    
    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description":client.translate.commands.dead.suicide.replace("%s", authorUsername)
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
    "clientPermissions": ["SEND_MESSAGES"]
};