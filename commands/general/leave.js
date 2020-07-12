module.exports.run = async function (client, message, args) {
	let arg = args.join(" ");
	if (arg === "") {
		let voiceChannel = message.member.voice.channel;
		if (voiceChannel === null) {
			message.reply("❎ เอ๋...ฉันไม่ได้อยู่ในช่องนั้นนะ ผีหลอกหรือเปล่า")
			.then(function (msg) {
				msg.delete({
					timeout: 10000
				});
			});
		} else {
			voiceChannel.leave();
			message.channel.send("◀️ ฉันออกมาจากช่องปัจจุบันแล้วคะ");
		}
	} else {
		let channel = client.channels.cache.find(channels => channels.id === arg || channels.name === arg);
		if (channel === undefined) {
			message.reply("❎ ไม่มีช่องนี้นะคะ พิมพ์ผิดหรือเปล่า?")
				.then(function (msg) {
					msg.delete({
						timeout: 10000
					});
				});
		} else {
			channel.leave();
			message.channel.send("◀️ ฉันออกมาจากช่องปัจจุบันแล้วคะ");
		}
	}
};

module.exports.help = {
	"name": "leave",
	"description": "Out of the current audio channel",
	"usage": "Yleave",
	"category": "general",
	"aliases": ["l", "ออกจาก"]
};