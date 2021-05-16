module.exports.run = async function (client, message, args) {
	let arg = args[0];
	if (!arg) return message.reply(client.lang.command_information_ban_arg_empty);
	
	let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
	if (!member) return message.reply(client.lang.command_infornation_ban_not_found_user);
	
	let memberBan = message.guild.members.cache.get(member.user.id);
	if (!memberBan) return message.reply(client.lang.command_information_ban_cant_ban);
	if (!memberBan.banable) return message.reply(client.lang.command_information_ban_banable_false);
	
	let reason = args.slice(1).join(" ");
	if (!reason) {
		reason = client.lang.command_information_ban_reason;
		return ban(member, memberBan, reason);
	}
	
	return ban(member, memberBan, reason);

	function ban(member, memberBan, reason) {
		let author = message.author.username;
		let authorAvatar = message.author.displayAvatarURL();
		let avatar = member.user.avatarURL();
		let username = member.user.username;
		let time = new Date();
		
		memberBan.ban(reason).then(function () {
			message.channel.send({
				"embed": {
					"title": username + client.lang.command_information_ban_function_ban_embed_title,
					"description": reason,
					"color": 16098851,
					"timestamp": time,
					"footer": {
						"icon_url": authorAvatar,
						"text": client.lang.command_information_ban_function_ban_embed_footer_text + author
					},
					"thumbnail": {
						"url": avatar
					},
					"author": {
						"name": client.lang.command_information_ban_function_ban_embed_author_name,
						"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bust-in-silhouette_1f464.png"
					}
				}
			});
		}).catch(function (error) {
			message.channel.send(client.lang.command_information_ban_function_ban_message_error + error);
			console.log(error);
		});
	}
};

module.exports.help = {
	"name": "ban",
	"description": "Ban a member",
	"usage": "ban <member: id, username, username&tag> (reason)",
	"category": "manager",
	"aliases": ["b", "แบน"],
	"permissions": ["SEND_MESSAGES", "BAN_MEMBERS"]
};