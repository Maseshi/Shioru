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

	// Update members count after user is quit this server
    let guild = client.guilds.cache.find(servers => servers.id === "618837514882514944");
	let memberCountChannel = guild.channels.cache.find(channels => channels.id === "694243041472544869");
	let memberCount = guild.memberCount;
	memberCountChannel.setName("▌สมาชิก: " + memberCount);
};