const discord = require("discord.js");

module.exports.run = async function (client, message, args) {
    let rip = new discord.MessageAttachment("https://i.imgur.com/w3duR07.png");
    if (rip === undefined) {
        message.reply("❎ เหห...ดูเหมือนว่าภาพนี้ อาจถูกลบหรือย้ายไปที่อื่นแล้วนะค่ะ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        message.channel.send(attachment);
    }
};

module.exports.help = {
    "name": "rip",
    "description": "Send RIP images",
    "usage": "Crip",
    "category": "fun",
    "aliases": ["RIP", "rip", "อาร์ไอพี"]
};