module.exports.run = async function (client, message, args) {
    if (message.member.id === client.config.owner) {
		let arg = args[0];
    	if (!arg) {
			message.reply("❓ กรุณาระบุรหัสผ่านด้วยคะเพื่อยืนยันว่าเป็นคุณจริงๆ");
		} else {
			message.delete();
			if (arg === client.config.password) {
				message.channel.send("🔄 กำลังปิดระบบตัวเอง...")
				.then(function (msg) {
					msg.edit("💤 ปิดระบบแล้วคะ...แล้วพบกันใหม่นะคะ Sayonara~~")
					.then(function () {
						client.destroy();
					}).catch(function (error) {
						message.channel.send("❌ ไม่สามารถปิดระบบได้ เนื่องจาก: " + error);
					});
				});
			} else {
				message.channel.send("❎ รหัสผ่านไม่ถูกต้องนะคะ ลองตรวจสอบใหม่อีกครั้งคะ");
			}
		}
    } else {
    	message.channel.send("🛑 อย่านะ..ไม่เอาๆ ฟังก์ชันนี้ต้องใช้สิทธิ์ระดับผู้ดูแลเท่านั้นนะ");
    }
};
	
module.exports.help = {
	"name": "shutdown",
	"description": "Shutdown the bot system.",
	"usage": "shutdown <password>",
	"category": "system",
	"aliases": ["sd", "ปิดระบบ"]
};