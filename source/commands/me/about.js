module.exports.run = function (client, message, args) {
	message.channel.send({
		"embeds": [
			{
				"title": client.translate.commands.about.my_profile,
				"description": client.translate.commands.about.my_profile_detail.replace("%s", client.user.username),
				"color": 14684245,
				"timestamp": client.config.data.update,
				"author": {
					"icon_url": client.user.avatarURL(),
					"name": client.user.username
				},
				"footer": {
					"icon_url": "https://hotemoji.com/images/emoji/t/1utnwrapq218t.png",
					"text": client.translate.commands.about.update_on
				}
			}
		]
	});
};

module.exports.help = {
	"name": "about",
	"description": "See information about bots.",
	"usage": "about",
	"category": "me",
	"aliases": ["information", "botinfo", "botInfo", "เกี่ยวกับ", "เกี่ยวกับบอท"],
	"permissions": ["SEND_MESSAGES"]
};