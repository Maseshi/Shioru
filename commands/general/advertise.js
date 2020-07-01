module.exports.run = async function (client, message, args) {
    let channel = message.guild.channels.cache.find(channel => channel.name === "│ประชาสัมพันธ์📢");
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let text = args.join(" ");
    if (text === undefined) {
        message.reply("❓ กรุณาเขียนข้อความที่จะประชาสัมพันธ์ด้วยค่ะ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let embed = {
            "description": text,
            "color": 4868682,
            "author": {
                "name": username,
                "icon_url": avatar
            }
        };
        channel.send({ embed })
        .then(function () {
            message.channel.send("✅ ส่งข้อความประชาสัมพันธ์แล้วคะ");
        });
    }
};

module.exports.help = {
    "name": "advertise",
    "description": "Send promotional messages",
    "usage": "Cadvertise",
    "category": "general",
    "aliases": ["adv", "ประชาสัมพันธ์"]
};