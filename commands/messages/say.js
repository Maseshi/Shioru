module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        let channel = args[0];
        let text = args.slice(1).join(" ");
        let channelInfo = message.guild.channels.cache.find(channels => (channels.id === channel) || (channels.name === channel));
        if (!channelInfo) {
            if (args.join(" ") === "") {
                message.reply("❓ ต้องการให้ฉันพิมพ์ว่าอะไรเหรอคะ");
            } else {
                message.delete()
                    .then(function () {
                        message.channel.send(args.join(" "));
                    });
            }
        } else {
            message.delete()
                .then(function () {
                    channelInfo.send(text)
                        .catch(function (error) {
                            message.channel.send("⚠️ ไม่สามารถส่งข้อความได้ เนื่องจาก: " + error);
                        });
                });
        }
    } else {
        message.channel.send("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ");
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "say (channel) <text>",
    "category": "messages",
    "aliases": ["s", "พูด", "ส่งข้อความ"]
};