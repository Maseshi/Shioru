module.exports.run = async function (client, message) {
    message.channel.send("📖 อดใจรอในเร็วๆ นี้คะ >-<");
};

module.exports.help = {
    "name": "levelingBoard",
    "description": "See the ranking of people with the most EXP and Level on the server.",
    "usage": "YlevelingBoard",
    "category": "fun",
    "aliases": ["lBoard", "levelingB"]
};