module.exports.run = async function (client, message, args) {
    let role = message.guild.roles.cache.find(role => role.name === "Member");
    let member = message.guild.members.cache.find(member => member.id === message.author.id);
    let username = message.author.username;
    
    if (args.join(" ") === "") {
        message.reply("❓ นี่ๆ บอกบทบาทที่อยากได้ให้ฉันด้วยสิ");
    } else {
        if (args.join(" ") === "Member" || args.join(" ") === "member") {
            if (member.roles.cache.some(role => role.name === "Member")) {
                message.channel.send("🛑 " + username + " คุณมีบทบาทนี้อยู่แล้วนะ อย่าโลภสิ..ไม่ดีๆ");
            } else {
                member.role.add(role);
                message.channel.send("✔ " + username + " ฉันเพิ่มบทบาทให้แล้วคะ อย่าลืมไปทักทาย Opus ด้วยละ...");
            }
        } else {
            message.reply("❎ ไม่มีบทบาทนี้นะคะ");
        }
    }
};

module.exports.help = {
    "name": "role",
    "description": "Give member roles",
    "usage": "Yrole",
    "category": "members",
    "aliases": ["rank", "บทบาท"]
};