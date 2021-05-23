module.exports.run = async function (client, message, args) {
	message.channel.createInvite().then(function (invite) {
		message.channel.send({
			"embed": {
				"description": "||" + invite.url + "||",
				"color": 10197915,
				"footer": {
					"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/ticket_1f3ab.png",
					"text": client.data.language.command_fun_invite_embed_footer_text
				},
				"author": {
					"name": client.data.language.command_fun_invite_embed_author_name,
					"icon_url": "https://discordapp.com/assets/5e5ab6737c6e2b6a9aa7a1e7295d1b41.svg"
				}
			}
		});
	}).catch(function (error) {
		message.channel.send(client.data.language.command_fun_invite_embed_function_error + error);
		console.log(error);
	});
};
	
module.exports.help = {
	"name": "invite",
	"description": "Create and receive invitation links to join the server.",
	"usage": "invite",
	"category": "fun",
	"aliases": ["เชิญ"],
	"permissions": ["SEND_MESSAGES", "CREATE_INSTANT_INVITE"]
};