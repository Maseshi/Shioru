module.exports = function (client, member) {
	let notification = member.guild.channels.cache.find(ch => ch.name === "│การแจ้งเตือน🔔");
	if (member.user.bot) {
		return;
	} else {
		let embed = {
			"title": member.user.tag,
			"description": client.lang.event_guild_guildMemberAdd_embed_description,
			"color": 16777215,
			"thumbnail": {
				"url": member.user.displayAvatarURL(),
			},
			"author": {
				"name": client.lang.event_guild_guildMemberAdd_embed_author_name,
				"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/video-game_1f3ae.png",
			}
		};
		notification.send({ embed });
	}
};