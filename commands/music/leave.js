module.exports.run = async function (client, message, args) {
	let arg = args.join(" ");
	if (arg === "") {
		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply("❓ เอ๋...ฉันไม่ได้อยู่ในช่องนั้นนะ ผีหลอกหรือเปล่า");
		} else {
			voiceChannel.leave();
			message.channel.send("◀️ ฉันออกมาจากช่องปัจจุบันแล้วคะ");
		}
	} else {
		let channel = client.channels.cache.find(channels => (channels.id === arg) || (channels.name === arg));
		if (!channel) {
			message.channel.send("❎ ไม่มีช่องนี้นะคะ พิมพ์ผิดหรือเปล่า?");
		} else {
			channel.leave();
			message.channel.send("◀️ ฉันออกมาจากช่องปัจจุบันแล้วคะ");
		}
	}
};

module.exports.help = {
	"name": "leave",
	"description": "Out of the current audio channel",
	"usage": "leave (name/id)",
	"category": "music",
	"aliases": ["l", "dis", "disconnect", "ออก", "ออกจาก"]
};