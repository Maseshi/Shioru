// This command is not yet available. //

module.exports.run = async function (client, message, args) {
	if (message.member.hasPermission(["ADMINISTRATOR", "BAN_MEMBERS"])) {
		let arg = args[0];
		if (!arg) {
			message.reply("❓ จะให้ฉันจัดการกับสมาชิกคนไหนเหรอคะ");
		} else {
			let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
			if (!user) {
				message.channel.send("❎ ฉันหาสมาชิกนี้ไม่เจอคะ ลองตรวจสอบใหม่อีกรอบคะ");
			} else {
				let memberBan = message.guild.members.cache.get(user.id);
				if (!memberBan) {
					message.channel.send("❎ เอ๋...สมาชิกนี้หายไปไหนแล้วอ่ะ เอ๋...หรือไม่ได้อยู่ที่นี่หรือเปล่า");
				} else {
					if (memberBan.banable === false) {
						message.channel.send("❌ ฉันไม่มีสิทธิ์ที่จะแบนเขานะคะ ถ้าหากมีเหตุผลใดๆ ที่เขาทำอะไรไม่ดีให้แจ้งเจ้าของที่นี่นะคะ ตอนนี้ฉันทำอะไรเขาไม่ด้ายยย...");
					} else {
						let reason = args.slice(1).join(" ");
						if (reason === "") {
							reason = "**สมาชิกที่แบนไม่ได้ให้เหตุผลไว้คะ**";
							ban(user, memberBan, reason);
						} else {
							ban(user, memberBan, reason);
						}
					}
				}
			}
		}
	} else {
		message.channel.send("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ");
	}

	function ban(user, memberBan, reason) {
		let notification = message.guild.channels.cache.find(ch => ch.name === "│การแจ้งเตือน🔔");

		let author = message.author.username;
		let authorAvatar = message.author.displayAvatarURL();
		let avatar = user.avatarURL();
		let username = user.username;
		let time = new Date();
		memberBan.ban(reason)
			.then(function () {
				let embed = {
					"title": username + " โดนแบน เนื่องจาก:",
					"description": reason,
					"color": 16098851,
					"timestamp": time,
					"footer": {
						"icon_url": authorAvatar,
						"text": "แบนโดย " + author
					},
					"thumbnail": {
						"url": avatar
					},
					"author": {
						"name": "สมาชิก",
						"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bust-in-silhouette_1f464.png"
					}
				};
				notification.send({
					embed
				});
			}).catch(function (error) {
				message.channel.send("⚠️ ฉันทำไม่ได้คะ เพราะว่า: " + error);
				console.log(error);
			});
	}
};

module.exports.help = {
	"name": "ban",
	"description": "Ban a member",
	"usage": "ban <member> (reason)",
	"category": "manager",
	"aliases": ["b", "แบน"]
};