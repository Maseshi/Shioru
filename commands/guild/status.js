module.exports.run = async function (client, message, args) {
    let status = args.join(" ");
    if (status === "") {
        message.reply("❓ ต้องการตรวจสอบสถานะอะไรดีคะ online, offline, idle, dnd")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        if (status === "online", "offline", "idle", "dnd") {
            let icon = message.guild.iconURL();
            if (status === "online") {
                let onlineCount = message.guild.members.cache.filter(member => member.presence.status === "online").size;

                let online = {
                    "description": "จำนวนสมาชิกที่ออนไลน์ในขณะนี้ คือ \n```" + onlineCount + "```",
                    "color": 3055702,
                    "footer": {
                        "icon_url": icon,
                        "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                    }
                };
                message.channel.send({ embed: online });
            }
            if (status === "offline") {
                let offlineCount = message.guild.members.cache.filter(member => member.presence.status === "offline").size;

                let offline = {
                    "description": "จำนวนสมาชิกที่ออฟไลน์ในขณะนี้ คือ \n```" + offlineCount + "```",
                    "color": 10197915,
                    "footer": {
                        "icon_url": icon,
                        "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                    }
                };
                message.channel.send({ embed: offline });
            }
            if (status === "idle") {
                let idleCount = message.guild.members.cache.filter(member => member.presence.status === "idle").size;

                let idle = {
                    "description": "จำนวนสมาชิกที่ไม่อยู่ในขณะนี้ คือ \n```" + idleCount + "```",
                    "color": 16098851,
                    "footer": {
                        "icon_url": icon,
                        "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                    }
                };
                message.channel.send({ embed: idle });
            }
            if (status === "dnd") {
                let dndCount = message.guild.members.cache.filter(member => member.presence.status === "dnd").size;

                let dnd = {
                    "description": "จำนวนสมาชิกที่ห้ามรบกวนในขณะนี้ คือ \n```" + dndCount + "```",
                    "color": 13632027,
                    "footer": {
                        "icon_url": icon,
                        "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
                    }
                };
                message.channel.send({ embed: dnd });
            }
        } else {
            message.reply("❎ ไม่มีสถานะนี้ใน Discord นะคะ สถานะที่มีคือ online, offline, idle, dnd");
        }
    }
};

module.exports.help = {
    "name": "status",
    "description": "Check the status of all members within the server",
    "usage": "Ystatus <status>",
    "category": "guild",
    "aliases": ["สถานะ"]
};