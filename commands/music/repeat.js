module.exports.run = function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let loop = parseInt(args[0]);
        let queue = client.music.getQueue(message);
        
        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!loop) return message.reply("❓ ต้องการเลือกเป็นโหมดเลขอะไรดีคะ (0: วนซ้ำภายในคิว), (1: วนซ้ำเพลงปัจจุบัน), (2: ปิดการวนซ้ำ)");
        if (loop <= 0) return message.reply("❎ ไม่มีโหมดที่ต่ำกว่านี้แล้วคะ");
        if (loop >= 2) return message.reply("❎ ไม่มีโหมดที่สูงกว่านี้แล้วคะ");
    
        let mode = client.music.setRepeatMode(message, loop);
        message.channel.send(client.data.language.command_music_loop_queue_loop.replace("%boolean", (mode = mode ? mode == 2 ? "ทำซ้ำคิว" : "ทำซ้ำเพลง" : "ปิดการทำซ้ำ")));
    } else {
        message.reply(client.data.language.command_music_loop_no_queue);
    }
};

module.exports.help = {
    "name": "repeat",
    "description": "Toggle music repeat",
    "usage": "repeat <mode: 0, 1, 2>",
    "category": "music",
    "aliases": ["loop", "วน", "ทำซ้ำ"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};