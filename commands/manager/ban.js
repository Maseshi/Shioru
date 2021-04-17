module.exports.run = async function (client, message, args) {
	if (message.member.hasPermission(["ADMINISTRATOR", "BAN_MEMBERS"])) {
		let arg = args[0];
		if (!arg) {
			message.reply(client.lang.command_information_ban_arg_empty);
		} else {
			let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
			if (!user) {
				message.channel.send(client.lang.command_infornation_ban_not_found_user);
			} else {
				let memberBan = message.guild.members.cache.get(user.id);
				if (!memberBan) {
					message.channel.send(client.lang.command_information_ban_cant_ban);
				} else {
					if (memberBan.banable === false) {
						message.channel.send(client.lang.command_information_ban_banable_false);
					} else {
						let reason = args.slice(1).join(" ");
						if (reason === "") {
							reason = client.lang.command_information_ban_reason;
							ban(user, memberBan, reason);
						} else {
							ban(user, memberBan, reason);
						}
					}
				}
			}
		}
	} else {
		message.channel.send(client.lang.command_information_ban_dont_have_permission);
	}

	function ban(user, memberBan, reason) {
		let author = message.author.username;
		let authorAvatar = message.author.displayAvatarURL();
		let avatar = user.avatarURL();
		let username = user.username;
		let time = new Date();
		memberBan.ban(reason)
		.then(function () {
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
	"usage": "ban <member> (reason)",
	"category": "manager",
	"aliases": ["b", "แบน"]
};