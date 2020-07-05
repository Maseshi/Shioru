module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        let channel = args[0];
        let text = args.slice(1).join(" ");
        if (channel === undefined) {
            message.reply("❓ ต้องการให้ฉันส่งข้อความในช่องไหนดีคะ")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            if (channel === "this" || "ที่นี่") {
                if (text === "") {
                    message.reply("❓ ต้องการให้ฉันพิมพ์ว่าอะไรเหรอคะ")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
                } else {
                    message.delete()
                    .then(function () {
                        message.channel.send(text);
                    });
                }
            } else {
                if (text === "") {
                    message.reply("❓ ต้องการให้ฉันพิมพ์ว่าอะไรเหรอคะ")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
                } else {
                    let channelInfo = message.guild.channels.cache.find(channels => (channels.id === channel) || (channels.name === channel));
                    if (channelInfo === undefined) {
                        message.channel.send("❎ เอ๋...ดูเหมือนจะไม่มีช่องนี้นะคะ ลองตรวจสอบดีๆ อีกครั้งคะ..!");
                    } else {
                        message.delete()
                        .then(function () {
                            channelInfo.send(text)
                            .then(function () {
                                message.channel.send("✅ ส่งข้อความไปที่ <#" + channelInfo.id + "> เรียบร้อยแล้วคะ");
                            }).catch(function (error) {
                                message.channel.send("❌ ไม่สามารถส่งข้อความได้ เนื่องจาก: " + error);
                            });
                        });
                    }
                }
            }
        }
    } else {
        message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ <:shioru_heavy:694159309877018685>");
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "Ysay <channel or <this>> <text>",
    "category": "owner",
    "aliases": ["s", "พูด", "ส่งข้อความ"]
};