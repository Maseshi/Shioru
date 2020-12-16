module.exports.run = async function (client, message, args) {
	let arg = args.join(" ");
	if (arg === "") {
		let voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.reply("❓ คุณต้องเข้าร่วมช่องก่อนนะคะ ไม่งั้นฉันไม่รู้ว่าช่องไหน =3=");
		} else {
			voiceChannel.join()
			.then(function (connection) {
				message.channel.send("▶️ ตอนนี้ฉันอยู่ในช่อง `" + connection.channel.name + "` เรียบร้อยแล้วคะ");
			}).catch(function (error) {
				message.channel.send("❌ เกิดข้อผิดพลาดคะ เนื่องจาก: " + error);
			});
		}
	} else {
		let channel = client.channels.cache.find(channels => (channels.id === arg) || (channels.name === arg));
		if (!channel) {
			message.channel.send("❎ ไม่มีช่องนี้นะคะ พิมพ์ผิดหรือเปล่า?");
		} else {
			channel.join()
			.then(function (connection) {
				message.channel.send("✅ ฉันอยู่ในช่อง `" + connection.channel.name + "` เรียบร้อยแล้วค้าา...");
			});
		}
	}
};

module.exports.help = {
	"name": "join",
	"description": "Join audio channel",
	"usage": "join (name/id)",
	"category": "music",
	"aliases": ["j", "เข้าร่วม"]
};
