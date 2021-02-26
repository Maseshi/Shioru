module.exports.run = async function (client, message, args) {
    let username = message.author.username;
    let embed = {
        "color": 1,
        "description": username + client.lang.command_fun_kill_embed_description
    };
    message.channel.send({ embed });
};

module.exports.help = {
    "name": "kill",
    "description": "Fake message that says you commit suicide",
    "usage": "kill",
    "category": "fun",
    "aliases": ["die", "dead", "ฆ่า", "ตาย"]
};