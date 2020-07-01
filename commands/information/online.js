module.exports.run = async function (client, message, args) {
	let onlineCount = message.guild.members.cache.filter(member => member.presence.status === "online").size;
	let icon = message.guild.iconURL();

	let embed = {
		"description": "สมาชิกที่ออนไลน์อยู่ในขณะนี้ คือ \n```" + onlineCount + "```",
		"color": 8311585,
		"footer": {
			"icon_url": icon,
			"text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์",
		}
	};
	message.channel.send({ embed });
};

module.exports.help = {
	"name": "online",
	"description": "See members who are online.",
	"usage": "Conline",
	"category": "information",
	"aliases": ["memberOnline", "on", "mOn", "สมาชิกออนไลน์", "ออน", "ออนไลน์"]
};