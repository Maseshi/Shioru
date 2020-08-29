module.exports.run = async function (client, message, args) {
	message.guild.channels.cache.first().createInvite()
	.then(function (invite) {
		let embed = {
			"description": "||" + invite.url + "||",
			"color": 10197915,
			"footer": {
				"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/ticket_1f3ab.png",
				"text": "สินค้านี้ฟรี ห้ามวางจำหนายต่อ"
			},
			"author": {
				"name": "บัตรเชิญสมาชิก",
				"icon_url": "https://discordapp.com/assets/5e5ab6737c6e2b6a9aa7a1e7295d1b41.svg"
			}
		};
		message.channel.send({ embed });
	}).catch(function (error) {
		message.channel.send("⚠️ อ้าว...อยู่ๆ ฉันก็สร้างลิงค์เชิญไม่ได้คะ เหตุผลเพราะ: " + error);
		console.log(error);
	});
};
	
module.exports.help = {
	"name": "invite",
	"description": "Create and receive invitation links to join the server.",
	"usage": "Yinvite",
	"category": "members",
	"aliases": ["เชิญ"]
};