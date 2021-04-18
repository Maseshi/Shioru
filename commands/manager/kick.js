module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "KICK_MEMBERS"])) {
		let arg = args[0];
		if (!arg) {
			message.reply(client.lang.command_manager_kick_arg_empty);
		} else {
			let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
			if (!user) {
				message.channel.send(client.lang.command_manager_kick_not_found_user);
			} else {
				let memberKick = message.guild.members.cache.get(user.id);
				if (!memberKick) {
					message.channel.send(client.lang.command_manager_kick_cant_ban);
				} else {
					if (memberKick.kickable === false) {
						message.channel.send(client.lang.command_manager_kick_kickable_false);
					} else {
						let reason = args.slice(1).join(" ");
						if (reason === "") {
							reason = client.lang.command_manager_kick_reason;
							kick(user, memberKick, reason);
						} else {
							kick(user, memberKick, reason);
						}
					}
				}
			}
		}
    } else {
    	message.reply(client.lang.command_manager_kick_dont_have_permission);
	}
	
	function kick(user, memberKick, reason) {
		let author = message.author.username;
		let authorAvatar = message.author.displayAvatarURL();
		let avatar = user.avatarURL();
		let username = user.username;
		let time = new Date();
		memberKick.kick(reason)
		.then(function () {
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
		}).catch(function (error) {
			message.channel.send(client.lang.command_manager_kick_function_kick_message_error + error);
			console.log(error);
		});
	}
};
	
module.exports.help = {
	"name": "kick",
	"description": "Kick a member",
	"usage": "kick <member<id, username, username&tag>> (reason)",
	"category": "manager",
	"aliases": ["k", "เตะ"]
};