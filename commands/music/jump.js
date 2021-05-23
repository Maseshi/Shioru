module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let jump = parseInt(args[0]);
        let queue = client.music.getQueue(message);
    
        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!jump) return message.reply(client.data.language.command_music_skipto_aeg_empty);
        if (jump <= 0) return message.reply("*️⃣ ไม่มีคิวที่ต่ำกว่านี้แล้วนะคะ");
        if (jump > queue.songs.length) return message.reply("🔢 ไม่มีคิวดังกล่าวคะ ลองตรวจสอบใหม่ดูอีกครั้งนะคะ");
    
        try {
            client.music.jump(message, jump - 1);
        } catch (error) {
            message.reply("❎ ดูเหมือนว่าจะไม่มีหมายเลขคิวดังกล่าวเลยนะคะ ลองตรวจสอบใหม่อีกครั้งคะ");
        }
    } else {
        message.reply(client.data.language.command_music_skipto_no_queue);
    }
};

module.exports.help = {
    "name": "jump",
    "description": "Skip to the selected queue number",
    "usage": "jump <number>",
    "category": "music",
    "aliases": ["skipto", "ข้ามไปที่"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};