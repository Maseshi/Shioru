// This command is not yet available. //

module.exports.run = async function (client, message, args) {
	if (message.member.hasPermission(["ADMINISTRATOR", "BAN_MEMBERS"])) {
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.member(user);
			if (member) {
				member
					.ban({
						reason: "พวกเขานิสัยไม่ดีเลยอ่ะ 😢",
					})
					.then(() => {
						message.reply(`แบน ${user.tag} แล้วค่ะ`);
					})
					.catch(err => {
						message.reply("แบนไม่ได้อ๊าาาา...");
						console.error(err);
					});
			} else {
				message.reply("ชื่อไม่คุ้นเลยนะคะ เขียนผิดหรือเปล่าคะ ❔");
			}
		} else {
			message.reply("ขอชื่อสมาชิกด้วยคะ");
		}
	} else {
		return message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ <:shioru_heavy:694159309877018685>");
	}
};

module.exports.help = {
	"name": "ban",
	"description": "Ban a member",
	"usage": "Yban",
	"category": "manager",
	"aliases": ["b", "แบน"]
};