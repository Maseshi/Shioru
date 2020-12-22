const discord = require("discord.js");
const os = require("os");
const cpuStat = require("cpu-stat");

module.exports.run = async function (client, message, args) {
    let msg = await message.channel.send("⚙️ กำลังประมวลผล รอสักครู่นะคะ...");
    cpuStat.usagePercent(function (error, percent) {
        if (error) {
            msg.edit("⚠️ เกิดข้อผิดพลาด: " + error);
            console.error(error);
        } else {
            let totalSeconds = (client.uptime / 1000);
            // let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            // let seconds = Math.floor(totalSeconds % 60);

            //let duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            let embed = {
                "title": "🖥 ข้อมูลของระบบ",
                "description": "ข้อมูลที่ฉันกำลังทำงานอยู่ในขณะนี้ ตามที่ทางระบบให้ข้อมูลมา ได้ดังนี้คะ",
                "color": 4886754,
                "fields": [
                    {
                        "name": "• หน่วยความจำที่ใช้ไป",
                        "value": (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "/" + (os.totalmem() / 1024 / 1024).toFixed(2) + "MB",
                        "inline": true
                    },
                    {
                        "name": "• เวลาทำงาน",
                        "value": hours + "h " + minutes + "m",
                        "inline": true
                    },
                    {
                        "name": "• เซิร์ฟเวอร์",
                        "value": "Google.inc",
                        "inline": true
                    },
                    {
                        "name": "• เจ้าของ",
                        "value": "Maseshi",
                        "inline": true
                    },
                    {
                        "name": "• Discord.js",
                        "value": "v" + discord.version,
                        "inline": true
                    },
                    {
                        "name": "• Node.js",
                        "value": process.version,
                        "inline": true
                    },
                    {
                        "name": "• CPU",
                        "value": "```md\n" + os.cpus().map(i => i.model)[0] + "```",
                        "inline": true
                    },
                    {
                        "name": "• CPU ที่ใช้ไป",
                        "value": "`" + percent.toFixed(2) + "%`",
                        "inline": true
                    },
                    {
                        "name": "• แพลตฟอร์ม",
                        "value": "``" + os.platform() + "``",
                        "inline": true
                    }
                ]
            };
            msg.edit("", { embed });
        }
    });
};

module.exports.help = {
    "name": "system",
    "description": "Get system operating status and more",
    "usage": "system",
    "category": "system",
    "aliases": ["sys", "ระบบ"]
};