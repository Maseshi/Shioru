module.exports.run = function (client, message, args) {
	let arg = args[0];
	if (!arg) return message.reply(client.translate.commands.ban.empty);
	
	let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
	if (!member) return message.reply(client.translate.commands.ban.user_not_found);
	
	let memberBan = message.guild.members.cache.get(member.user.id);
	if (!memberBan) return message.reply(client.translate.commands.ban.missing_user);
	if (!memberBan.banable) return message.reply(client.translate.commands.ban.can.not.ban);
	
	let reason = args.slice(1).join(" ");
	if (!reason) {
		reason = client.translate.commands.ban.no_reason;
		ban(member, memberBan, reason);
	} else {
		ban(member, memberBan, reason);
	}

	function ban(member, memberBan, reason) {
		let author = message.author.username;
		let authorAvatar = message.author.displayAvatarURL();
		let avatar = member.user.avatarURL();
		let username = member.user.username;
		let time = new Date();
		
		memberBan.ban({ "reason": reason }).then(function () {
			message.channel.send({
				"embeds": [
					{
						"title": client.translate.commands.ban.was_banned_because.replace("%s", username),
						"description": reason,
						"color": 16098851,
						"timestamp": time,
						"footer": {
							"icon_url": authorAvatar,
							"text": client.translate.commands.ban.banned_by.replace("%s", author)
						},
						"thumbnail": {
							"url": avatar
						},
						"author": {
							"name": client.translate.commands.ban.member,
							"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bust-in-silhouette_1f464.png"
						}
					}
				]
			});
		});
	}
};

module.exports.help = {
	"name": "ban",
	"description": "Ban a member",
	"usage": "ban <member: id, username, username&tag> (reason)",
	"category": "guild",
	"aliases": ["b", "แบน"],
	"permissions": ["SEND_MESSAGES", "BAN_MEMBERS"]
};