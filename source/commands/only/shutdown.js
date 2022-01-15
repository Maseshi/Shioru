const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    if (message.member.id !== client.config.owner) return message.reply(client.translate.commands.shutdown.not_owner);
	
	const inputPassword = args[0];
	
	if (!inputPassword) return message.reply(client.translate.commands.shutdown.password_is_required);
	if (inputPassword !== client.config.password) return message.reply(client.translate.commands.shutdown.password_is_incorrect);

	message.channel.send(client.translate.commands.shutdown.shutting_down).then((msg) => {
		msg.edit(client.translate.commands.shutdown.now_shutdown).then(() => {
			client.destroy();
		}).catch((error) => {
			catchError(client, message, module.exports.help.name, error);
		});
	});
};
	
module.exports.help = {
	"name": "shutdown",
	"description": "Shutdown the bot system.",
	"usage": "shutdown <password>",
	"category": "only",
	"aliases": ["sd", "ปิดระบบ"],
	"userPermission": ["ADMINISTRATOR"],
	"clientPermissions": ["SEND_MESSAGES"]
};