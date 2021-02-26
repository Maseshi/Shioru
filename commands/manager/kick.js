module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "KICK_MEMBERS"])) {
		let arg = args[0];
		if (!arg) {
			message.reply("❓ จะให้ฉันจัดการกับสมาชิกคนไหนเหรอคะ");
		} else {
			let user = message.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
			if (!user) {
				message.channel.send("❎ ฉันหาสมาชิกนี้ไม่เจอคะ ลองตรวจสอบใหม่อีกรอบคะ");
			} else {
				let memberKick = message.guild.members.cache.get(user.id);
				if (!memberKick) {
					message.channel.send("❎ เอ๋...สมาชิกนี้หายไปไหนแล้วอ่ะ เอ๋...หรือไม่ได้อยู่ที่นี่หรือเปล่า");
				} else {
					if (memberKick.kickable === false) {
						message.channel.send("❌ ฉันไม่มีสิทธิ์ที่จะนำเขาออกจากที่นี่นะคะ ถ้าหากมีเหตุผลใดๆ ที่เขาทำอะไรไม่ดีให้แจ้งเจ้าของที่นี่นะคะ ตอนนี้ฉันทำอะไรเขาไม่ด้ายยย...");
					} else {
						let reason = args.slice(1).join(" ");
						if (reason === "") {
							reason = "**สมาชิกที่แตะไม่ได้ให้เหตุผลไว้คะ**";
							kick(user, memberKick, reason);
						} else {
							kick(user, memberKick, reason);
						}
					}
				}
			}
		}
    } else {
    	message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ");
	}
	
	function kick(user, memberKick, reason) {
		let author = message.author.username;
		let authorAvatar = message.author.displayAvatarURL();
		let avatar = user.avatarURL();
		let username = user.username;
		let time = new Date();
		memberKick.kick(reason)
		.then(function () {
			let embed = {
				"title": username + " โดนเตะออก เนื่องจาก:",
				"description": reason,
				"color": 16098851,
				"timestamp": time,
				"footer": {
					"icon_url": authorAvatar,
					"text": "เตะโดย " + author
				},
				"thumbnail": {
					"url": avatar
				},
				"author": {
					"name": "สมาชิก",
					"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bust-in-silhouette_1f464.png"
				}
			};
			message.channel.send({ embed });
		}).catch(function (error) {
			message.channel.send("⚠️ ฉันทำไม่ได้คะ เพราะว่า: " + error);
			console.log(error);
		});
	}
};
	
module.exports.help = {
	"name": "kick",
	"description": "Kick a member",
	"usage": "kick <member> (reason)",
	"category": "manager",
	"aliases": ["k", "เตะ"]
};