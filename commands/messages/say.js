module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        let channel = args[0];
        let text = args.slice(1).join(" ");
        if (!channel) {
            message.reply("❓ ต้องการให้ฉันส่งข้อความในช่องไหนดีคะ");
        } else {
            if (channel === "this") {
                if (text === "") {
                    message.reply("❓ ต้องการให้ฉันพิมพ์ว่าอะไรเหรอคะ");
                } else {
                    message.delete()
                    .then(function () {
                        message.channel.send(text);
                    });
                }
            } else {
                if (text === "") {
                    message.reply("❓ ต้องการให้ฉันพิมพ์ว่าอะไรเหรอคะ");
                } else {
                    let channelInfo = message.guild.channels.cache.find(channels => (channels.id === channel) || (channels.name === channel));
                    if (!channelInfo) {
                        message.channel.send("❎ เอ๋...ดูเหมือนจะไม่มีช่องนี้นะคะ ลองตรวจสอบดีๆ อีกครั้งคะ..!");
                    } else {
                        message.delete()
                        .then(function () {
                            channelInfo.send(text)
                            .then(function () {
                                message.channel.send("✅ ส่งข้อความไปที่ <#" + channelInfo.id + "> เรียบร้อยแล้วคะ");
                            }).catch(function (error) {
                                message.channel.send("⚠️ ไม่สามารถส่งข้อความได้ เนื่องจาก: " + error);
                            });
                        });
                    }
                }
            }
        }
    } else {
        message.channel.send("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ");
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "Ysay <channel or <this>> <text>",
    "category": "messages",
    "aliases": ["s", "พูด", "ส่งข้อความ"]
};