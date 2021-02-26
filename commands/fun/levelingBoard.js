module.exports.run = async function (client, message) {
    message.channel.send(client.lang.command_coming_soon);
};

module.exports.help = {
    "name": "levelingBoard",
    "description": "See the ranking of people with the most EXP and Level on the server.",
    "usage": "levelingBoard",
    "category": "fun",
    "aliases": ["lBoard", "levelingB"]
};