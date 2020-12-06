module.exports = function (client, member) {
	let notification = member.guild.channels.cache.find(ch => ch.name === "║การแจ้งเตือน🔔");
	if (member.user.bot) {
		return;
	} else {
		const embed = {
			"title": member.user.username,
			"description": client.lang.event_guild_guildMemberRemove_embed_description,
			"color": 16777215,
			"thumbnail": {
				"url": member.user.displayAvatarURL(),
			}
		};
		notification.send({ embed });
	}
};