module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let filter = args[0];
        let queue = client.music.getQueue(message);
        let filterList = Object.keys(client.music.filters);
    
        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!filter) return message.reply("❓ ต้องการปรับเปลี่ยนเสียงเพลงของคุณเป็นแบบไหนดีคะ?", {
            "embed": {
                "title": "รูปแบบการกรองที่พร้อมใช้งาน",
                "description": "ปรับเปลี่ยนรูปแบบเสียงเพลงให้ไพเราะมากยิ่งขึ้นด้วยการใช้รูปแบบทั้ง " + filterList.length + " รูปแบบเหล่านี้ ```" + filterList + "```",
                "color": 14684245
            }
        });
        if (!filterList.includes(filter.toLowerCase())) return message.reply("❎ ไม่พบรูปแบบการกรองดังกล่าวเลยนะคะ ลองตรวจสอบใหม่อีกครั้งคะ");
    
        client.music.setFilter(message, filter.toLowerCase());
        message.channel.send("🎼 เปลี่ยนวิธีการกรองของเพลงเป็น: " + (filter.toLowerCase() || "ปิด"));
    } else {
        message.reply("❎ ไม่มีเพลงที่กำลังเล่นอยู่เลยนะคะ");
    }
};

module.exports.help = {
    "name": "filter",
    "description": "Filter your music to be more powerful.",
    "usage": "filter <option>",
    "category": "music",
	"aliases": ["กรอง", "bass"],
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};