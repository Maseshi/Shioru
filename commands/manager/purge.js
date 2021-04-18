module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
    	let messageCount = parseInt(args[0]);

    	if (isNaN(messageCount)) {
    		message.reply(client.lang.command_manager_purge_arg_empty);
    	} else {
    		if (messageCount > 100) {
    			message.channel.send(client.lang.command_manager_purge_over);
    		} else if (messageCount <= 0) {
    			message.channel.send(client.lang.command_manager_purge_less);
    		} else {
				message.channel.messages.fetch({
    				"limit": messageCount
    			}).then(function (messages) {
					message.delete();
    				message.channel.bulkDelete(messages, true);
    				message.channel.send(client.lang.command_manager_purge_clear_success.replace("%size", messages.size));
    			}).catch(function (error) {
					message.channel.send(client.lang.command_manager_purge_clear_error + error);
					console.log(error);
				});
			}
    	}
    } else {
    	message.reply(client.lang.command_manager_purge_dont_have_permission);
    }
};
	
module.exports.help = {
	"name": "purge",
	"description": "Delete a lot of messages",
	"usage": "purge <amount<1 - 100>>",
	"category": "manager",
	"aliases": ["clear", "messageDelete", "ลบข้อความ"]
};