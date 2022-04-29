module.exports.run = (client, message, args) => {
	message.channel.send({
		"embeds": [
			{
				"title": client.translate.commands.about.my_profile,
				"description": client.translate.commands.about.my_profile_detail.replace("%s", client.user.username),
				"color": 14684245,
				"timestamp": client.config.update,
				"author": {
					"iconURL": client.user.avatarURL(),
					"name": client.user.username
				},
				"footer": {
					"iconURL": "https://hotemoji.com/images/emoji/t/1utnwrapq218t.png",
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
	"aliases": ["information", "botinfo", "เกี่ยวกับ", "เกี่ยวกับบอท"],
	"clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
	"data": {
		"name": module.exports.help.name,
		"name_localizations": {
            "en-US": "about",
            "th": "เกี่ยวกับ"
        },
		"description": module.exports.help.description,
		"description_localizations": {
            "en-US": "See information about bots.",
            "th": "ดูข้อมูลเกี่ยวกับบอท"
        },
	},
	async execute(interaction) {
		await interaction.editReply({
			"embeds": [
				{
					"title": interaction.client.translate.commands.about.my_profile,
					"description": interaction.client.translate.commands.about.my_profile_detail.replace("%s", interaction.client.user.username),
					"color": 14684245,
					"timestamp": interaction.client.config.update,
					"author": {
						"iconURL": interaction.client.user.avatarURL(),
						"name": interaction.client.user.username
					},
					"footer": {
						"iconURL": "https://hotemoji.com/images/emoji/t/1utnwrapq218t.png",
						"text": interaction.client.translate.commands.about.update_on
					}
				}
			]
		});
	}
};