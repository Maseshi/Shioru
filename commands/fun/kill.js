module.exports.run = async function (client, message, args) {
    let username = message.author.username;
    let embed = {
        "color": 1,
        "description": username + " ตัดสินใจที่จะฆ่าตัวตาย 💔 หลับให้สบาย"
    };
    message.channel.send({ embed });
};

module.exports.help = {
    "name": "kill",
    "description": "Fake message that says you commit suicide",
    "usage": "Ckill",
    "category": "fun",
    "aliases": ["die", "dead", "ฆ่า", "ตาย"]
};