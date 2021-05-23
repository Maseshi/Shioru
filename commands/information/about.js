module.exports.run = async function (client, message, args) {
	message.channel.send({
		"embed": {
			"title": client.data.language.command_information_about_embed_title,
			"description": client.data.language.command_information_about_embed_description.replace("%packageName", client.user.username),
			"color": 14684245,
			"timestamp": client.data.config.data.update,
			"author": {
				"icon_url": client.user.avatarURL(),
				"name": client.user.username
			},
			"footer": {
				"icon_url": "https://hotemoji.com/images/emoji/t/1utnwrapq218t.png",
				"text": client.data.language.command_information_about_embed_footer_text
			}
		}
	});
};

module.exports.help = {
	"name": "about",
	"description": "See information about bots.",
	"usage": "about",
	"category": "information",
	"aliases": ["information", "botinfo", "botInfo", "เกี่ยวกับ", "เกี่ยวกับบอท"],
	"permissions": ["SEND_MESSAGES"]
};