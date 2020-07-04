module.exports.run = async function (client, message, args) {
    let role = message.guild.roles.cache.find(role => role.name === "Member");
    let member = message.guild.members.cache.find(member => member.id === message.author.id);
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    if (member.roles.cache.some(role => role.name === "Member")) {
        let embed = {
            "title": "คุณมีบทบาทนี้อยู่แล้วนะ",
            "description": "เดี่ยวสิ!!...จะแกล้งฉันรึเปล่าเนี่ย นาย/เธอมีบทบาทนี้อยู่แล้วนะ อย่าโลภสิ ทำตัวไม่น่ารักเอาซ่ะเลยย...เดี่ยวก็ถอดบทบาทออกให้ซ่ะหรอก",
            "color": 16098851
        };
        message.channel.send({
            embed
        });
    } else {
        member.roles.add(role);
        let embed = {
            "title": "ร่าเริงตามอัธยาศัยเลยจร้าา...",
            "description": "เอาละๆ ตอนนี้นาย/เธอสามารถทำอะไรก็ได้ละ จะสังเกตได้ว่ามีช่องเพิ่มมาใช่ไหมล่าา...ใช่แล้ว ฉันเสกช่องเหล่านั้นมาเองยังไงละ✨\n*แล้วก็อย่าลืมเรื่องกฏระเบียบของเซิร์ฟเวอร์นี้ด้วยละ*\n\nถ้านาย/เธอต้องการอะไร สามารถบอกฉันได้ตลอดเวลาเลยนะที่ <#638418327202562088> มีวิธีติดต่อกับฉันอยู่น้าา...ไปอ่านกันด้วยละ",
            "color": 4886754,
            "footer": {
                "icon_url": avatar,
                "text": username + " ได้รับบทบาท 'Member' แล้ว"
            }
        };
        message.channel.send({ embed });
    }
};

module.exports.help = {
    "name": "role",
    "description": "Give member roles",
    "usage": "Yrole",
    "category": "members",
    "aliases": ["rank", "บทบาท"]
};