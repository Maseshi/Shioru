module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
    	let messageCount = parseInt(args[0]);

    	if (isNaN(messageCount)) {
    		message.reply("❓ จะลบกี่ข้อความดีคะ")
    		.then(function (msg) {
    			msg.delete({
    				timeout: 10000
    			});
    		});
    	} else {
    		if (messageCount > 100) {
    			message.reply("100 กว่าข้อความเลยเหรอ!!...ขอโทษนะ แต่ฉันลบไม่ไหวน้าา")
    			.then(function (msg) {
    				msg.delete({
    					timeout: 10000
    				});
    			});
    		} else {
    			message.channel.messages.fetch({
    				"limit": messageCount
    			}).then(function (messages) {
    				message.channel.bulkDelete(messages, true);
    				message.channel.send("ลบข้อความจำนวน `" + messages.size + " ข้อความ` ให้เรียบร้อยแล้วคะ :dash:");
    			});
    		}
    	}
    } else {
    	message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ <:shioru_heavy:694159309877018685>");
    }
};
	
module.exports.help = {
	"name": "purge",
	"description": "Delete a lot of messages",
	"usage": "Ypurge <amount>",
	"category": "owner",
	"aliases": ["clear", "messageDelete", "ลบข้อความ"]
};