module.exports.run = async function (client, message, args) {
    if (message.member.id === client.config.owner) {
		let arg = args[0];
    	if (!arg) {
			message.reply(client.lang.command_system_shutdown_please_enter_password);
		} else {
			message.delete();
			if (arg === client.config.password) {
				message.channel.send(client.lang.command_system_shutdown_shuting_down)
				.then(function (msg) {
					msg.edit(client.lang.command_system_system_off)
					.then(function () {
						client.destroy();
					}).catch(function (error) {
						message.channel.send(client.lang.command_system_shutdown_cant_shutdown + error);
					});
				});
			} else {
				message.channel.send(client.lang.command_system_shutdown_password_wrong);
			}
		}
    } else {
    	message.channel.send(client.lang.command_system_shutdown_dont_have_permission);
    }
};
	
module.exports.help = {
	"name": "shutdown",
	"description": "Shutdown the bot system.",
	"usage": "shutdown <password>",
	"category": "system",
	"aliases": ["sd", "ปิดระบบ"]
};