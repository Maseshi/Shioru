module.exports.run = async function (client, message, args) {
    let channel = message.guild.channels.cache.find(channel => channel.name === "│ประชาสัมพันธ์📢");

    if (args.length > 0) {
        let user = client.users.cache.find(user => user.username == args[0] || user.id == args[0]);
        let reason = args[1];

        if (user === undefined) {
            message.channel.send("❎ อืมม...ดูเหมือนจะไม่มีสมาชิกนี้นะคะ ลองตรวจสอบดีๆ อีกครั้งนะคะ!!");
        } else {
            if (reason === undefined) {
                message.reply("❓ เหตุผลที่จะรายงานเขาคืออะไรเหรอคะ")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
            } else {
                let id = user.id;
                client.users.fetch(id)
                .then(function (target) {
                    reportMember(target, reason);
                });
            }
        }
    } else {
        message.reply("❓ โปรดระบุชื่อหรือรหัสของสมาชิกที่จะรายงานด้วยคะ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    }

    function reportMember(target, reason) {
        let reportAvatarURL = message.author.displayAvatarURL();
        let reportName = message.author.username;
        let avatarURL = target.avatarURL();
        let name = target.username;
        let thisTime = new Date();
        let embed = {
            "title": name,
            "description": reason,
            "color": 13632027,
            "timestamp": thisTime,
            "footer": {
                "icon_url": reportAvatarURL,
                "text": reportName
            },
            "thumbnail": {
                "url": avatarURL
            },
            "author": {
                "name": "รายงาน",
                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/cheering-megaphone_1f4e3.png"
            }
        };
        message.react("👍").then(() => message.react("👎"));

        const filter = (reaction, user) => {
            return ["👍", "👎"].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        message.awaitReactions(filter, {
                max: 1,
                time: 60000,
                errors: ["time"]
            })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === "👍") {
                    message.reply("you reacted with a thumbs up.");
                } else {
                    message.reply("you reacted with a thumbs down.");
                }
            });
        message.channel.send("✅ ส่งข้อมูลรายงานสมาชิกแล้ว และกำลังทำการโหวต");
        channel.send({ embed });
    }
};

module.exports.help = {
    "name": "report",
    "description": "Report wrongdoing Let members vote Check and ban or touch members.",
    "usage": "Creport <name or id> <reason>",
    "category": "members",
    "aliases": ["rp", "รายงาน"]
};