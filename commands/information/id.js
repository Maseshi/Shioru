module.exports.run = async function (client, message, args) {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    message.reply("ID: " + member.user.id);
};

module.exports.help = {
    "name": "id",
    "description": "Get your id",
    "usage": "Cid",
    "category": "information",
    "aliases": ["myid", "myId", "ID", "รหัส", "ไอดี"]
};