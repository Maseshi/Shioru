module.exports.run = async function (client, message) {
    if (message.member.id === client.config.owner) {
    	message.channel.send("🔄 กำลังปิดระบบ...")
    	.then(function (msg) {
			msg.edit("💤 ปิดระบบแล้วคะ...แล้วพบกันใหม่นะคะ Sayonara~~")
			.then(function () {
				client.destroy();
			}).catch(function (error) {
				message.channel.send("❌ ไม่สามารถปิดระบบได้ เนื่องจาก: " + error);
			});
    	});
    } else {
    	message.reply("🛑 อย่านะ..ไม่เอาๆ ฟังก์ชันนี้ต้องใช้สิทธิ์ระดับผู้ดูแลเท่านั้นนะ");
    }
};
	
module.exports.help = {
	"name": "shutdown",
	"description": "Shutdown the bot system.",
	"usage": "Yshutdown",
	"category": "system",
	"aliases": ["sd", "ปิดระบบ"]
};