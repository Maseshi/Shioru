module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        let sayMessage = args.join(" ");
        if (sayMessage === undefined) {
            message.reply("❓ จะให้ฉันพิมพ์ว่าอะไรแทนเหรอ");
        } else {
            message.channel.send(sayMessage);
        }
    } else {
        message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ <:shioru_heavy:694159309877018685>");
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "Ysay <text>",
    "category": "owner",
    "aliases": ["s", "พูด"]
};