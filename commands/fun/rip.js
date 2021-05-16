const discord = require("discord.js");

module.exports.run = async function (client, message, args) {
    let rip = new discord.MessageAttachment("https://i.imgur.com/w3duR07.png");
    if (!rip) return message.reply(client.lang.command_fun_rip_message_attachment_not_rip);
    message.channel.send(rip);
};

module.exports.help = {
    "name": "rip",
    "description": "Send RIP images",
    "usage": "rip",
    "category": "fun",
    "aliases": ["RIP", "rip", "อาร์ไอพี"],
    "permissions": ["SEND_MESSAGES"]
};