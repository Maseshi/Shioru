module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let skip = args.join(" ");
        let queue = client.music.getQueue(message);
    
        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!skip) message.reply("❓ กรุณาระบุชื่อของเพลงที่จะเล่นด้วยคะ");
    
        client.music.playSkip(message, skip);
        message.channel.send("⏭ ข้ามไปยังเพลงดังกล่าวแล้วคะ");
    } else {
        message.reply("❎ ไม่มีเพลงที่ฉันกำลังเล่นอยู่เลยนะคะ");
    }
};

module.exports.help = {
    "name": "playSkip",
    "description": "Skip the playing song and play a song or playlist",
    "usage": "playSkip <song>",
    "category": "music",
    "aliases": ["เล่นข้าม", "plays", "pskip"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};