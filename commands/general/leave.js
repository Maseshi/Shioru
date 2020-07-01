module.exports.run = async function (client, message, args) {
	if (message.member.voice.channel) {
		let channelName = message.member.voice.channel.name;
		let leave = message.member.voice.channel.leave();

		if (leave === undefined) {
			message.channel.send(":arrow_left: ทะลุออกมาจากช่อง: `" + channelName + "` แล้วคะ");
		} else {
			message.channel.send("❌ ฉันไม่ได้อยู่ในช่องอยู่แล้วนะคะ");
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
	"name": "leave",
	"description": "Out of the current audio channel",
	"usage": "Cleave",
	"category": "general",
	"aliases": ["l", "ออกจาก"]
};