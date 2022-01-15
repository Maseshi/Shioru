const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    if (message.member.id !== client.config.owner) return message.reply(client.translate.commands.reboot.not_owner);
	
	const inputPassword = args[0];
	
	if (!inputPassword) return message.reply(client.translate.commands.reboot.password_is_required);
	if (inputPassword === client.config.password) return message.reply(client.translate.commands.reboot.password_is_incorrect);
	
	message.channel.send(client.translate.commands.reboot.rebooting).then((msg) => {
		client.destroy();
		client.login(client.config.token);
		msg.edit(client.translate.commands.reboot.now_reboot);
	}).catch((error) => {
		catchError(client, message, module.exports.help.name, error);
	});
};

module.exports.help = {
	"name": "reboot",
	"description": "Reboot the bot system.",
	"usage": "reboot <password>",
	"category": "only",
	"aliases": ["re", "เริ่มระบบใหม่"],
	"userPermission": ["ADMINISTRATOR"],
	"clientPermissions": ["SEND_MESSAGES"]
};