module.exports.run = async function (client, message, args) {
	let arg = args[0];
	if (!arg) return message.reply(client.lang.command_manager_kick_arg_empty);
	
	let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
	if (!member) return message.reply(client.lang.command_manager_kick_not_found_user);

	let memberKick = message.guild.members.cache.get(member.id);
	if (!memberKick) return message.reply(client.lang.command_manager_kick_cant_ban);
	if (!memberKick.kickable) return message.reply(client.lang.command_manager_kick_kickable_false);

	let reason = args.slice(1).join(" ");
	if (!reason) {
		reason = client.lang.command_manager_kick_reason;
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
		memberKick.kick(reason).then(function () {
			message.channel.send({
				"embed": {
					"title": username + client.lang.command_manager_kick_function_kick_embed_title,
					"description": reason,
					"color": 16098851,
					"timestamp": time,
					"footer": {
						"icon_url": authorAvatar,
						"text": client.lang.command_manager_kick_function_kick_embed_footer_text + author
					},
					"thumbnail": {
						"url": avatar
					},
					"author": {
						"name": client.lang.command_manager_kick_function_kick_embed_author_name,
						"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bust-in-silhouette_1f464.png"
					}
				}
			});
		});
	}
};
	
module.exports.help = {
	"name": "kick",
	"description": "Kick a member",
	"usage": "kick <member: id, username, username&tag> (reason)",
	"category": "manager",
	"aliases": ["k", "เตะ"],
	"permissions": ["SEND_MESSAGES", "KICK_MEMBERS"]
};