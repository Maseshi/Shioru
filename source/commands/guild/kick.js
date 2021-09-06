module.exports.run = function (client, message, args) {
	let arg = args[0];
	if (!arg) return message.reply(client.translate.commands.kick.empty);
	
	let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
	if (!member) return message.reply(client.translate.commands.kick.can_not_find_user);

	let memberKick = message.guild.members.cache.get(member.id);
	if (!memberKick) return message.reply(client.translate.commands.kick.missing_user);
	if (!memberKick.kickable) return message.reply(client.translate.commands.kick.can_not_kick);

	let reason = args.slice(1).join(" ");
	if (!reason) {
		reason = client.translate.commands.kick.no_reason;
		kick(member, memberKick, reason);
	} else {
		kick(member, memberKick, reason);
	}
	
	function kick(member, memberKick, reason) {
		let author = message.author.username;
		let authorAvatar = message.author.displayAvatarURL();
		let avatar = member.user.avatarURL();
		let username = member.user.username;
		let time = new Date();
		memberKick.kick({ "reason": reason }).then(function () {
			message.channel.send({
				"embeds": [
					{
						"title": client.translate.commands.kick.was_kicked_because.replace("%s", username),
						"description": reason,
						"color": 16098851,
						"timestamp": time,
						"footer": {
							"icon_url": authorAvatar,
							"text": client.translate.commands.kick.kicked_by.replace("%s", author)
						},
						"thumbnail": {
							"url": avatar
						},
						"author": {
							"name": client.translate.commands.kick.member,
							"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bust-in-silhouette_1f464.png"
						}
					}
				]
			});
		});
	}
};
	
module.exports.help = {
	"name": "kick",
	"description": "Kick a member",
	"usage": "kick <member: id, username, username&tag> (reason)",
	"category": "guild",
	"aliases": ["k", "เตะ"],
	"permissions": ["SEND_MESSAGES", "KICK_MEMBERS"]
};