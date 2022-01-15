const catchError = require("../../extras/catchError");

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
	}).catch((error) => {
		catchError(client, message, module.exports.help.name, error);
	});
};
	
module.exports.help = {
	"name": "invite",
	"description": "Create and receive invitation links to join the server.",
	"usage": "invite",
	"category": "guild",
	"aliases": ["เชิญ"],
	"userPermission": ["CREATE_INSTANT_INVITE"],
	"clientPermissions": ["SEND_MESSAGES", "CREATE_INSTANT_INVITE"]
};