const discord = require("discord.js");
const os = require("os");
const cpuStat = require("cpu-stat");

module.exports.run = async function (client, message, args) {
    let msg = await message.channel.send("⚙️ กำลังประมวลผล..รอสักครู่นะคะ...");
    cpuStat.usagePercent(function (error, percent) {
        if (error) {
            msg.edit("❌ เกิดข้อผิดพลาด: " + error);
            console.error(error);
        } else {
            let totalSeconds = (client.uptime / 1000);
            totalSeconds %= 3600;
            let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor(totalSeconds / 60);
            let second = totalSeconds % 60;

            //let duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            let embed = {
                "title": "ข้อมูลของระบบ",
                "description": "ข้อมูลที่ฉันกำลังทำงานอยู่ในขณะนี้ ตามที่ทางระบบให้ข้อมูลมา ได้ดังนี้คะ",
                "color": 4886754,
                "footer": {
                    "icon_url": "https://lectiondev.web.app/assets/static/favicon.ico",
                    "text": "ข้อมูลระบบเซิร์ฟเวอร์ของ LectionDev"
                },
                "fields": [
                    {
                        "name": "• Memory Usage",
                        "value": (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "/" + (os.totalmem() / 1024 / 1024).toFixed(2) + "MB",
                        "inline": true
                    },
                    {
                        name: "• Uptime",
                        "value": hours + "h " + minutes + "m",
                        "inline": true
                    },
                    {
                        "name": "• Servers",
                        "value": "Google.inc",
                        "inline": true
                    },
                    {
                        "name": "• Owner",
                        "value": "LectionDev",
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
                        "value": `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``,
                        "inline": true
                    },
                    {
                        "name": "• CPU usage",
                        "value": `\`${percent.toFixed(2)}%\``,
                        "inline": true
                    },
                    {
                        "name": "• Platform",
                        "value": `\`\`${os.platform()}\`\``,
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
    "usage": "Csystem",
    "category": "system",
    "aliases": ["sys", "ระบบ"]
};