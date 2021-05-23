module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let queue = client.music.getQueue(message);

        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
    
        let mode = client.music.toggleAutoplay(message);
        message.channel.send("📻 " + (mode ? "เปิด" : "ปิด") + "โหมดการเล่นอัตโนมัติแล้ว");
    } else {
        message.channel.send("❎ อืมม...แต่ว่าเพลงมันยังไม่ได้เริ่มเล่นเลยนะ?");
    }
};

module.exports.help = {
    "name": "autoplay",
    "description": "Turn on / off automatic music playing",
    "usage": "autoplay",
    "category": "music",
	"aliases": ["เล่นอัตโนมัติ", "autop", "atplay"],
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};