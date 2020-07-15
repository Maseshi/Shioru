const discord = require("discord.js");
const yts = require("yt-search");

module.exports.run = async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...");
    } else {
        if (message.channel.activeCollector) {
            message.reply("❌ ตัวรวบรวมข้อความ ใช้งานในช่องนี้อยู่แล้วคะ");
        } else {
            if (!args.length) {
                message.reply("❓ อยากได้เพลงอะไรเหรอคะ ลิงค์เลยก็ได้นะ");
            } else {
                let search = args.join(" ");
                let resultsEmbed = new discord.MessageEmbed()
                    .setTitle("🔎 ค้นหาเพลง")
                    .setDescription("ผลลัพธ์การค้นหา: **" + search + "**\nเลือกหมายเลขเพลงที่ต้องการเล่นเลย!! **รีบเลือกก่อน 1 นาทีละ...ไม่งั้นจะเลือกไม่ได้แล้วนะ** และหลังจากที่เลือกแล้วฉันจะเล่นให้ทันทีเลยคะ")
                    .setColor("#F8AA2A")
                    .setFooter(message.author.username, message.author.displayAvatarURL())
                    .setTimestamp();

                yts(search, async function (error, result) {
                    if (error) {
                        console.error(error);
                        return message.channel.send("❎ อืมม...ดูเหมือนจะไม่เจอเพลงนี้เลยนะ");
                    } else {
                        let videos = result.videos;
                        videos.map(function (video, index) {
                            if (index >= 10) return;
                            resultsEmbed.addField((index + 1) + ". " + video.title, video.url);
                        });

                        message.channel.send(resultsEmbed)
                        .then(async function (resultsMessage) {
                            message.channel.activeCollector = true;
                            let response = await message.channel.awaitMessages(filter, {
                                "max": 1,
                                "maxProcessed": 1,
                                "time": 60000,
                                "errors": ["time"]
                            });
                            let choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;

                            message.channel.activeCollector = false;
                            message.client.commands.get("play").run(client, message, [choice]);
                            resultsMessage.delete();
                        }).catch(function (error) {
                            console.error(error);
                            message.channel.activeCollector = false;
                        });
                    }
                });
            }
        }
    }

    function filter(msg) {
        if (msg.author.id !== message.author.id) return;
        return ["1", "2", "3", "5", "6", "7", "8", "9", "10"].includes(msg.content);
    }
};

module.exports.help = {
    "name": "search",
    "description": "Search and select videos to play",
    "usage": "Ysearch <music name>",
    "category": "music",
    "aliases": ["ค้นหา", "sch"]
};