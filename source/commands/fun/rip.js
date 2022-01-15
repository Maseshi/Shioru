const { MessageAttachment } = require("discord.js");

module.exports.run = (client, message, args) => {
    const rip = new MessageAttachment("https://i.imgur.com/w3duR07.png");
    
    if (!rip) return message.reply(client.translate.commands.rip.no_image);
    
    message.channel.send({ "files": [ rip ] });
};

module.exports.help = {
    "name": "rip",
    "description": "Send RIP images",
    "usage": "rip",
    "category": "fun",
    "aliases": ["RIP", "rip", "อาร์ไอพี"],
    "clientPermissions": ["SEND_MESSAGES", "ATTACH_FILES"]
};