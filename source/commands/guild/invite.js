const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
	message.channel.createInvite().then(function (invite) {
		message.channel.send({
			"embeds": [
				{
					"title": client.translate.commands.invite.membership_invitation_card,
					"description": "||" + invite.url + "||",
					"color": 10197915,
					"footer": {
						"icon_url": message.guild.iconURL(),
						"text": client.translate.commands.invite.this_product_is_free
					}
				}
			]
		});
	}).catch(function (error) {
		catchError(client, message, module.exports.help.name, error);
	});
};
	
module.exports.help = {
	"name": "invite",
	"description": "Create and receive invitation links to join the server.",
	"usage": "invite",
	"category": "guild",
	"aliases": ["เชิญ"],
	"permissions": ["SEND_MESSAGES", "CREATE_INSTANT_INVITE"]
};