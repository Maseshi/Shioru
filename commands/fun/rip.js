const discord = require("discord.js");

module.exports.run = async function (client, message, args) {
    let rip = new discord.MessageAttachment("https://i.imgur.com/w3duR07.png");
    if (!rip) {
        message.channel.send("❎ เหห...ดูเหมือนว่าภาพนี้ อาจจะถูกลบหรือย้ายไปที่อื่นแล้วนะค่ะ");
    } else {
        message.channel.send(rip);
    }
};

module.exports.help = {
    "name": "rip",
    "description": "Send RIP images",
    "usage": "Yrip",
    "category": "fun",
    "aliases": ["RIP", "rip", "อาร์ไอพี"]
};