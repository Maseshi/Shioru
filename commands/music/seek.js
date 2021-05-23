module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let seek = parseInt(args[0]);
        let queue = client.music.getQueue(message);
        let queueDuration = queue.songs.map((song, id) => song.duration);
        let queueFormatDuration = queue.songs.map((song, id) => song.formatDuration);
    
        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!seek) return message.reply("❓ ต้องการเปลี่ยนเวลาของเพลงที่เล่นอยู่เป็นเวลากี่วินาทีดีคะ? ตอนนี้เล่นอยู่วินาทีที่ " + queueDuration);
        if (seek <= 0) return message.reply("❎ ต่ำกว่านี้มันไม่มีอะไรนะ อยากเริ่มใหม่เหรอ?");
        if (seek >= queueDuration) return message.reply("❎ เวลาของเพลงนี้อยู่ที่ " + queueFormatDuration + " เกินกว่านี้ก็ไม่มีอะไรอะ");
    
        client.music.seek(message, seek*1000);
        message.channel.send("🕘 เปลี่ยนแปลงเวลาของเพลงที่เล่นอยู่ในปัจจุบันแล้วคะ");
    } else {
        message.reply("❎ ตอนนี้ยังไม่มีเพลงที่กำลังเล่นอยู่เลยนะคะ");
    }
};

module.exports.help = {
    "name": "seek",
    "description": "Change the duration of the currently playing song",
    "usage": "seek <time>",
    "category": "music",
    "aliases": ["ช่วง", "duration"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};