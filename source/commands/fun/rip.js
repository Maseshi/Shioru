const { MessageAttachment } = require("discord.js");

module.exports.run = function (client, message, args) {
    let rip = new MessageAttachment("https://i.imgur.com/w3duR07.png");
    if (!rip) return message.reply(client.translate.commands.rip.no_image);
    message.channel.send({ "files": [ rip ] });
};

module.exports.help = {
    "name": "rip",
    "description": "Send RIP images",
    "usage": "rip",
    "category": "fun",
    "aliases": ["RIP", "rip", "อาร์ไอพี"],
    "permissions": ["SEND_MESSAGES"]
};