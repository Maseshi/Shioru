module.exports.run = async function (client, message, args) {
    if (message.member.id === client.config.owner) {
		message.channel.send("🔄 กำลังเริ่มระบบใหม่...")
		.then(function (msg) {
			client.destroy();
			client.login(client.config.token);
			msg.edit("✅ เริ่มระบบใหม่แล้วคะ!!");
    	}).catch(function () {
    		msg.edit("❌ ไม่สามารถเริ่มระบบใหม่ได้ เนื่องจาก: " + error);
    	});
    } else {
    	message.reply("🛑 อย่านะ..ไม่เอาๆ ฟังก์ชันนี้ต้องใช้สิทธิ์ระดับผู้ดูแลเท่านั้นนะ");
    }
};

module.exports.help = {
	"name": "reboot",
	"description": "Reboot the bot system.",
	"usage": "Yreboot",
	"category": "system",
	"aliases": ["re", "เริ่มระบบใหม่"]
};