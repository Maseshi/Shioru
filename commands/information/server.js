module.exports.run = async function (client, message, args) {
    let guildCreatedAt = message.guild.createdAt;
    let guildCreatedAtFormat = new Date(guildCreatedAt);

    let guildIcon = message.guild.iconURL();
    let guildTier = message.guild.premiumTier;
    let guildName = message.guild.name;
    let guildVerified = message.guild.verified;
    let guildID = message.guild.id;
    let guildOwner = message.guild.owner;
    let guildRegion = message.guild.region;
    let guildVerificationLevel = message.guild.verificationLevel;

    if (guildVerificationLevel == "NONE") {
        guildVerificationLevel = "ไม่มี";
    }
    if (guildVerificationLevel == "LOW") {
        guildVerificationLevel = "ต่ำ";
    }
    if (guildVerificationLevel == "MEDIUM") {
        guildVerificationLevel = "ปานกลาง";
    }
    if (guildVerificationLevel == "HIGH") {
        guildVerificationLevel = "สูง";
    }
    if (guildVerificationLevel == "VERY_HIGH") {
        guildVerificationLevel = "สูงที่สุด";
    }

    let guildMemberCount = message.guild.memberCount;
    let guildRolesSize = message.guild.roles.cache.size;
    let guildChannelsSize = message.guild.channels.cache.size;
    let guildEmojiSize = message.guild.emojis.cache.size;
    message.channel.send({
        "embed": {
            "title": "📖 รายละเอียดข้อมูลเซิร์ฟเวอร์",
            "color": 4886754,
            "timestamp": guildCreatedAtFormat,
            "footer": {
                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/hammer_1f528.png",
                "text": "เซิร์ฟเวอร์ถูกสร้างเมื่อ"
            },
            "thumbnail": {
                "url": guildIcon
            },
            "fields": [
                {
                    "name": "ชื่อ",
                    "value": guildName,
                    "inline": true
                },
                {
                    "name": "ยืนยัน",
                    "value": guildVerified,
                    "inline": true
                },
                {
                    "name": "รหัสเซิร์ฟเวอร์",
                    "value": guildID,
                    "inline": true
                },
                {
                    "name": "เจ้าของ",
                    "value": guildOwner,
                    "inline": true
                },
                {
                    "name": "ภูมิภาค",
                    "value": guildRegion,
                    "inline": true
                },
                {
                    "name": "ระดับการยืนยัน",
                    "value": guildVerificationLevel,
                    "inline": true
                },
                {
                    "name": "เงินกองทุนชั้นที่",
                    "value": guildTier,
                    "inline": true
                },
                {
                    "name": "สมาชิก",
                    "value": guildMemberCount,
                    "inline": true
                },
                {
                    "name": "บทบาท",
                    "value": guildRolesSize,
                    "inline": true
                },
                {
                    "name": "ช่อง",
                    "value": guildChannelsSize,
                    "inline": true
                },
                {
                    "name": "อีโมจิ",
                    "value": guildEmojiSize,
                    "inline": true
                }
            ]
        }
    });
};

module.exports.help = {
    "name": "server",
    "description": "Get server information",
    "usage": "server",
    "category": "guild",
    "aliases": ["serverInfo", "si", "เกี่ยวกับเซิร์ฟเวอร์"]
};