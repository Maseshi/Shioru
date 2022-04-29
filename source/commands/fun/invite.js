module.exports.run = (client, message, args) => {
	message.channel.createInvite().then((invite) => {
		const guildIcon = message.guild.iconURL();

		message.channel.send({
			"embeds": [
				{
					"title": client.translate.commands.invite.membership_invitation_card,
					"description": "||" + invite.url + "||",
					"color": 10197915,
					"footer": {
						"text": client.translate.commands.invite.this_product_is_free,
						"iconURL": guildIcon
					}
				}
			]
		});
	});
};

module.exports.help = {
	"name": "invite",
	"description": "Create and receive invitation links to join the server.",
	"usage": "invite",
	"category": "fun",
	"aliases": ["เชิญ"],
	"userPermissions": ["CREATE_INSTANT_INVITE"],
	"clientPermissions": ["SEND_MESSAGES", "CREATE_INSTANT_INVITE"]
};

module.exports.interaction = {
	"data": {
		"name": module.exports.help.name,
		"name_localizations": {
            "en-US": "invite",
            "th": "เชิญ"
        },
		"description": module.exports.help.description,
		"description_localizations": {
            "en-US": "Create and receive invitation links to join the server.",
            "th": "สร้างและรับลิงค์คำเชิญเพื่อเข้าร่วมเซิร์ฟเวอร์นี้"
        }
	},
	async execute(interaction) {
		interaction.channel.createInvite().then(async (invite) => {
			const guildIcon = interaction.guild.iconURL();

			await interaction.editReply({
				"embeds": [
					{
						"title": interaction.client.translate.commands.invite.membership_invitation_card,
						"description": "||" + invite.url + "||",
						"color": 10197915,
						"footer": {
							"text": interaction.client.translate.commands.invite.this_product_is_free,
							"iconURL": guildIcon
						}
					}
				]
			});
		});
	}
};