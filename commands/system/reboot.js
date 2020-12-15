module.exports.run = async function (client, message, args) {
    if (message.member.id === client.config.owner) {
		let arg = args[0];
		if (!arg) {
			message.reply("❓ กรุณาระบุรหัสผ่านยืนยันอีกครั้งด้วยคะ");
		} else {
			message.delete();
			if (arg === client.config.password) {
				message.channel.send("🔄 กำลังเริ่มระบบใหม่...")
				.then(function (msg) {
					client.destroy();
					client.login(client.config.token);
					msg.edit("✅ เริ่มระบบใหม่แล้วคะ!!");
				}).catch(function (error) {
					msg.edit("❌ ไม่สามารถเริ่มระบบใหม่ได้ เนื่องจาก: " + error);
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
	"name": "reboot",
	"description": "Reboot the bot system.",
	"usage": "Yreboot",
	"category": "system",
	"aliases": ["re", "เริ่มระบบใหม่"]
};