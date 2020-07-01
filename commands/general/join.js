module.exports.run = async function (client, message, args) {
	if (message.member.voice.channel) {
		let channelName = message.member.voice.channel.name;
		let join = message.member.voice.channel.join();

		if (join) {
			message.channel.send(":arrow_right: ฉันอยู่ใน: `" + channelName + "` เรียบร้อยแล้วค่ะ");
		} else {
			message.channel.send("❌ ฉันอยู่ในช่องปัจจุบันอยู่แล้วนะคะ");
		}
	} else {
		message.reply("❌ เอ๋ะ...ดูเหมือนว่าคุณยังไม่ได้อยู่ในช่องเสียงนะค่ะ")
		.then(function (msg) {
			msg.delete({
				timeout: 10000
			});
		});
	}
};

module.exports.help = {
	"name": "join",
	"description": "Join audio channel",
	"usage": "Cjoin",
	"category": "general",
	"aliases": ["j", "เข้าร่วม"]
};
