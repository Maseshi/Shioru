module.exports.run = async function (client, message, args) {
    let username = message.author.username;
    message.channel.send({
        "embed": {
            "color": 1,
            "description": username + client.data.language.command_fun_dead_embed_description
        }
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