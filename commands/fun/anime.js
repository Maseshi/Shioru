const kitsu = require("kitsu");

module.exports.run = async function (client, message, args) {
    const Kitsu = new kitsu();

    function titles(data) {
        let numTitle = [];
        for (let i = 0; i < 5; i++) {
            numTitle.push("\n" + (i + 1) + "." + title(i, data));
        }
        return numTitle.join(" ");
    }

    function title(index, data) {
        let line1 = data[index].titles.en_jp ? data[index].titles.en_jp : "";
        let line2 = data[index].titles.en ? " / " + data[index].titles.en : "";
        return line1 + line2;
    }

    function filter(msg) {
        if (msg.author.id !== message.author.id) return;
        return ["1", "2", "3", "4", "5"].includes(msg.content);
    }

    if (args.length < 1) {
        message.reply("❓ ต้องการอนิเมะเรื่องอะไรเหรอ");
    } else {
        let msg = await message.channel.send("🔎 กำลังค้าหาข้อมูลจาก Kitsu! โปรดรอสักครู่นะ.. >.<");
        let info = await Kitsu.fetch("anime" || "manga", {
            "filter": {
                "text": args.join(" ")
            }
        });

        if (info.data.length < 1) {
            msg.edit("❎ ไม่เจอเรื่องนี้นะ ลองตรวจสอบดีๆ ดูสิหรืออาจจะไม่มีเรื่องนี้จริงๆ อะ");
        } else {
            let anime = {
                "title": args.join(" "),
                "description": "ฉันเจอ 5 เรื่องที่ใกล้เคียงกัน อยากอ่านเรื่องไหนกันละ~",
                "color": 12601856,
                "footer": {
                    "icon_url": client.user.avatarURL(),
                    "text": "เพียงแค่พิมพ์หมายเลขที่คุณต้องการอ่าน! (ยกเลิกภายใน 1 นาที)"
                },
                "author": {
                    "name": "Kitsu",
                    "url": "https://kitsu.io",
                    "icon_url": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                },
                "fields": [
                    {
                        "name": "เลือกเลยย.!!",
                        "value": titles(info.data)
                    }
                ]
            };
            msg = await msg.edit("", { "embed": anime });

            if (!msg.content) return;
            let collected = await message.channel.awaitMessages(filter, {
                "max": 20,
                "maxProcessed": 1,
                "time": 60000,
                "errors": ["time"]
            });
            let returnMessage = collected.first();
            let index = Number(returnMessage.content);
            let conclude = {
                "color": 12601856,
                "footer": {
                    "icon_url": client.user.avatarURL(),
                    "text": "นี่เป็นเพียงข้อมูลที่สรุปมาแล้วเท่านั้น อยากอ่านเพิ่มเติมคลิกเข้าไปที่ลิงค์เลยย.!!"
                },
                "author": {
                    "name": "Kitsu",
                    "url": "https://kitsu.io",
                    "icon_url": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                },
                "fields": [
                    {
                        "name": "**ชื่อญี่ปุ่น**",
                        "value": info.data[index].titles.en_jp || "ไม่ได้กำหนด"
                    },
                    {
                        "name": "**ชื่ออังกฤษ**",
                        "value": info.data[index].titles.en || "ไม่ได้กำหนด"
                    },
                    {
                        "name": "**ประเภท:**",
                        "value": info.data[index].subtype
                    },
                    {
                        "name": "**วันที่เริ่มต้น**",
                        "value": info.data[index].startDate,
                        "inline": true
                    },
                    {
                        "name": "**วันที่สิ้นสุด**",
                        "value": info.data[index].endDate || "กำลังดำเนินการ",
                        "inline": true
                    },
                    {
                        "name": "**อันดับความนิยม**",
                        "value": info.data[index].popularityRank,
                        "inline": true
                    },
                    {
                        "name": "**ลิงค์**",
                        "value": "<https://kitsu.io/anime/" + info.data[index].id + ">"
                    },
                    {
                        "name": "**สรุป:**",
                        "value": "```" + info.data[index].synopsis + "```"
                    }
                ]
            };
            msg.edit({
                "embed": conclude
            });
        }
    }
};

module.exports.help = {
    "name": "anime",
    "description": "Search for anime available on Kitsu.",
    "usage": "Yanime <title>",
    "category": "fun",
    "aliases": ["an", "cartoon", "อนิเมะ", "การ์ดตูน"]
};