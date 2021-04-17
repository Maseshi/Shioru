module.exports.run = async function (client, message, args) {
    if (message.member.id === client.config.owner) {
		let arg = args[0];
		if (!arg) {
			message.reply(client.lang.command_system_reboot_please_enter_password);
		} else {
			message.delete();
			if (arg === client.config.password) {
				message.channel.send(client.lang.command_system_reboot_restarting)
				.then(function (msg) {
					client.destroy();
					client.login(client.config.token);
					msg.edit(client.lang.command_system_reboot_restarted);
				}).catch(function (error) {
					msg.edit(client.lang.command_system_reboot_cant_restart + error);
				});
			} else {
				message.channel.send(client.lang.command_system_reboot_password_wrong);
			}
		}
    } else {
    	message.channel.send(client.lang.command_system_reboot_dont_have_permission);
    }
};

module.exports.help = {
	"name": "reboot",
	"description": "Reboot the bot system.",
	"usage": "reboot <password>",
	"category": "system",
	"aliases": ["re", "เริ่มระบบใหม่"]
};