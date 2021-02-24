module.exports.run = async function (client, message, args) {
	message.guild.channels.cache.first().createInvite()
	.then(function (invite) {
		let embed = {
			"description": "||" + invite.url + "||",
			"color": 10197915,
			"footer": {
				"icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/ticket_1f3ab.png",
				"text": client.lang.command_fun_invite_embed_footer_text
			},
			"author": {
				"name": client.lang.command_fun_invite_embed_author_name,
				"icon_url": "https://discordapp.com/assets/5e5ab6737c6e2b6a9aa7a1e7295d1b41.svg"
			}
		};
		message.channel.send({ embed });
	}).catch(function (error) {
		message.channel.send(client.lang.command_fun_invite_embed_function_error + error);
		console.log(error);
	});
};
	
module.exports.help = {
	"name": "invite",
	"description": "Create and receive invitation links to join the server.",
	"usage": "invite",
	"category": "members",
	"aliases": ["เชิญ"]
};