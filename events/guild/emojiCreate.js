module.exports = function (client, emoji) {
	let guild = client.guilds.cache.find(servers => servers.id === "618837514882514944");
	let notification = guild.channels.cache.find(ch => ch.name === "║การแจ้งเตือน🔔");
	let embed = {
		"description": client.lang.event_guild_emojiCreate_embed_description.replace("%emoji", emoji.name),
		"color": 4886754,
		"author": {
			"name": client.lang.event_guild_notification_way_system,
			"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bell_1f514.png"
		}
	};
	notification.send({ embed });
};