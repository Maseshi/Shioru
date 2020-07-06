module.exports = async message => {
	let notification = member.guild.channels.cache.find(ch => ch.name === "│การแจ้งเตือน🔔");
	const embed = {
		"title": member.user.tag,
		"description": "ได้หนีออกจากเซิร์ฟเวอร์นี้ไปแล้วว...(ไปไหนของเขากันน้าาา..)",
		"color": 16777215,
		"thumbnail": {
			"url": member.user.displayAvatarURL(),
		},
	};
	notification.send({ embed });
};