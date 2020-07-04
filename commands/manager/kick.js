// This command is not yet available. //

module.exports.run = async function (client, message, args) {
		message.delete();
        if (message.member.hasPermission(["ADMINISTRATOR", "KICK_MEMBERS"])) {
			const user = message.mentions.users.first();
			if (user) {
				const member = message.guild.member(user);
				if (member) {
					member.kick("กรุณาระบุเหตุผลเพิ่มเติมที่จะแสดงในบันทึกการตรวจสอบด้วยค่ะ")
						.then(() => {
							message.reply(`เตะแล้วค่ะ ⚽ | ลาก่อนนะ ${user.tag}`);
						})
						.catch(err => {
							message.reply("ทำไหมฉันเตะเขาออกไม่ได้ละคะ 😕");
							console.error(err);
						});
				} else {
					message.reply("เอ๋...ฉันหาสมาชิกนี้ไม่เจอค่ะ เขียนผิดหรือเปล่าคะ ❔");
				}
			} else {
				message.reply("บอกชื่อสมาชิกให้ฉันด้วยจิ...");
			}
		} else {
			return message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ <:shioru_heavy:694159309877018685>");
		}
	};
	
module.exports.help = {
	"name": "kick",
	"description": "Kick a member",
	"usage": "Ykick <member> <reason>",
	"category": "manager",
	"aliases": ["k", "เตะ"]
};