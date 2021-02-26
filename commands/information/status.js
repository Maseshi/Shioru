module.exports.run = async function (client, message, args) {
    let status = args.join(" ");
    if (status === "") {
        message.reply("❓ ต้องการตรวจสอบสถานะอะไรดีคะ online, offline, idle, dnd");
    } else {
        if (status === "online" || status === "offline" || status === "idle" || status === "dnd") {
            let icon = message.guild.iconURL();
            if (status === "online") {
                let onlineCount = message.guild.members.cache.filter(member => member.presence.status === "online").size;

                message.channel.send({
                    "embed": {
                        "description": "จำนวนสมาชิกที่ออนไลน์ในขณะนี้ คือ \n```" + onlineCount + "```",
                        "color": 3055702,
                        "footer": {
                            "icon_url": icon,
                            "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                        }
                    }
                });
            }
            if (status === "offline") {
                let offlineCount = message.guild.members.cache.filter(member => member.presence.status === "offline").size;

                message.channel.send({
                    "embed": {
                        "description": "จำนวนสมาชิกที่ออฟไลน์ในขณะนี้ คือ \n```" + offlineCount + "```",
                        "color": 10197915,
                        "footer": {
                            "icon_url": icon,
                            "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                        }
                    }
                });
            }
            if (status === "idle") {
                let idleCount = message.guild.members.cache.filter(member => member.presence.status === "idle").size;

                message.channel.send({
                    "embed": {
                        "description": "จำนวนสมาชิกที่ไม่อยู่ในขณะนี้ คือ \n```" + idleCount + "```",
                        "color": 16098851,
                        "footer": {
                            "icon_url": icon,
                            "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                        }
                    }
                });
            }
            if (status === "dnd") {
                let dndCount = message.guild.members.cache.filter(member => member.presence.status === "dnd").size;

                message.channel.send({
                    "embed": {
                        "description": "จำนวนสมาชิกที่ห้ามรบกวนในขณะนี้ คือ \n```" + dndCount + "```",
                        "color": 13632027,
                        "footer": {
                            "icon_url": icon,
                            "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                        }
                    }
                });
            }
        } else {
            message.reply("❎ ไม่มีสถานะนี้ใน Discord นะคะ...สถานะที่มีคือ online, offline, idle, dnd");
        }
    }
};

module.exports.help = {
    "name": "status",
    "description": "Check the status of all members within the server",
    "usage": "status <status>",
    "category": "guild",
    "aliases": ["สถานะ"]
};