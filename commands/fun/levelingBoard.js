// This command is not yet available. //

module.exports.run = async function (client, message) {
    leveling.Leaderboard({
        limit: 3
    }).then(async function (users) {
        let firstPlace;
        if (users[0]) firstPlace = await client.users.fetch(users[0].userid);

        let secondPlace;
        if (users[1]) secondPlace = await client.users.fetch(users[1].userid);

        let thirdPlace;
        if (users[2]) thirdPlace = await client.users.fetch(users[2].userid);

        let embed = {
            "title": "สุดยอดผู้เก็บชั้นและ XP 🔥",
            "description": "1 ใน 3 ลำดับสมาชิกที่มีชั้น (Levels) และ XP เยอะที่สุดในเซิร์ฟเวอร์นี้",
            "color": 16711680,
            "footer": {
                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/thought-balloon_1f4ad.png",
                "text": "ทิป: ยิ่งคุยกันมากเท่าไหร่ ชั้นและ XP ก็จะยิ่งเพิ่มตามจำนวนที่ได้"
            },
            "thumbnail": {
                "url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bar-chart_1f4ca.png"
            },
            "fields": [
                {
                    "name": "```👑" + (firstPlace && firstPlace.tag || "ยังไม่มีใครเลย") + "```",
                    "value": `**ชั้นที่: ${users[0] && users[0].level || "ไม่มี"} XP: ${users[0] && users[0].xp || "ไม่มี"}**`
                },
                {
                    "name": "```🎓" + (secondPlace && secondPlace.tag || "ยังไม่มีใครเลย") + "```",
                    "value": `**ชั้นที่: ${users[1] && users[1].level || "ไม่มี"} XP: ${users[1] && users[1].xp || "ไม่มี"}**`
                },
                {
                    "name": "```🎩" + (thirdPlace && thirdPlace.tag || "ยังไม่มีใครเลย") + "```",
                    "value": `**ชั้นที่: ${users[2] && users[2].level || "ไม่มี"} XP: ${users[2] && users[2].xp || "ไม่มี"}**`
                }
            ]
        };
        message.channel.send({ embed });
    });
};

module.exports.help = {
    "name": "levelingBoard",
    "description": "See the ranking of people with the most EXP and Level on the server.",
    "usage": "ClevelingBoard",
    "category": "fun",
    "aliases": ["lBoard", "levelingB"]
};