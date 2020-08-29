module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
    	let messageCount = parseInt(args[0]);

    	if (isNaN(messageCount)) {
    		message.reply("❓ จะลบกี่ข้อความดีคะ ฉันสามารถลบได้ 1-100 ข้อความคะ");
    	} else {
    		if (messageCount > 100) {
    			message.channel.send("❌ 100 กว่าข้อความเลยเหรอ!! เออ...คือ ฉันลบข้อความเหล่านั้นไม่ไหวล่ะ");
    		} else {
    			message.channel.messages.fetch({
    				"limit": messageCount
    			}).then(function (messages) {
    				message.channel.bulkDelete(messages, true);
    				message.channel.send("ลบข้อความจำนวน `" + messages.size + " ข้อความ` ให้เรียบร้อยแล้วคะ 💨");
    			}).catch(function (error) {
					message.channel.send("⚠️ ลบข้อความไม่ได้อ่ะ เพราะว่า: " + error);
					console.log(error);
				});
    		}
    	}
    } else {
    	message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ");
    }
};
	
module.exports.help = {
	"name": "purge",
	"description": "Delete a lot of messages",
	"usage": "Ypurge <amount>",
	"category": "owner",
	"aliases": ["clear", "messageDelete", "ลบข้อความ"]
};